import jwt from "jsonwebtoken";
import config from "../config/config.js";
import Session from "../model/session.model.js";
import SessionMeeting from "../model/sessionMeeting.model.js";
import Notification from "../model/notification.model.js";

const meetingTimers = new Map();

const createNotification = async ({
  recipient,
  sender,
  session,
  message,
  link,
}) => {
  if (!recipient) return null;
  const notification = await Notification.create({
    recipient,
    sender,
    session,
    message,
    link: link || "",
  });
  return notification;
};

const cleanupMeetingRoom = async (roomId, io, reason) => {
  meetingTimers.delete(roomId);
  const meeting = await SessionMeeting.findOne({ roomId });
  if (!meeting) return;

  if (meeting.status === "ended" || meeting.status === "abandoned") {
    return;
  }

  meeting.status = reason === "abandoned" ? "abandoned" : "ended";
  await meeting.save();

  const session = await Session.findById(meeting.sessionId);
  if (session) {
    session.status = reason === "abandoned" ? "abandoned" : "completed";
    // Clear any active room id so clients know session is closed
    session.sessionRoomId = null;
    await session.save();
  }

  io.to(`session_${roomId}`).emit("session-ended", {
    reason:
      reason === "abandoned"
        ? "Other participant did not join. Session expired."
        : "Session ended.",
  });
  io.socketsLeave(`session_${roomId}`);
};

const scheduleWaitingExpiration = (roomId, io) => {
  if (meetingTimers.has(roomId)) {
    clearTimeout(meetingTimers.get(roomId));
  }

  const timer = setTimeout(
    async () => {
      const meeting = await SessionMeeting.findOne({ roomId });
      if (!meeting || meeting.participantJoined) return;
      await cleanupMeetingRoom(roomId, io, "abandoned");
    },
    30 * 60 * 1000,
  );

  meetingTimers.set(roomId, timer);
};

const initSessionSocket = (io) => {
  io.on("connection", async (socket) => {
    const token = socket.handshake.auth?.token;
    let authenticatedUserId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        authenticatedUserId = decoded.id;
        socket.join(`user_${authenticatedUserId}`);
      } catch (error) {
        console.warn("Invalid socket token", error.message);
      }
    }

    socket.on("join-room", async ({ roomId, userId, sessionId, userName }) => {
      if (!roomId || !sessionId || !userId) {
        return;
      }

      if (authenticatedUserId && authenticatedUserId !== userId) {
        return;
      }

      const session = await Session.findById(sessionId);
      if (
        !session ||
        !session.users.some((user) => user.toString() === userId)
      ) {
        return;
      }

      const meeting = await SessionMeeting.findOne({ roomId, sessionId });
      if (
        !meeting ||
        meeting.status === "ended" ||
        meeting.status === "abandoned"
      ) {
        return;
      }

      socket.join(`session_${roomId}`);
      const room = io.sockets.adapter.rooms.get(`session_${roomId}`);
      const existingCount = room ? room.size : 0;

      const otherUserId = session.users
        .find((u) => u.toString() !== userId)
        ?.toString();
      const userNameLabel = userName || "Participant";

      if (existingCount === 1) {
        meeting.participantJoined = true;
        meeting.status = "live";
        await meeting.save();
      }

      if (existingCount === 0) {
        meeting.hostJoined = true;
        meeting.waitingStartedAt = new Date();
        meeting.status = "waiting";
        await meeting.save();

        if (otherUserId) {
          await createNotification({
            recipient: otherUserId,
            sender: userId,
            session: sessionId,
            message: `${userNameLabel} is waiting for you in session`,
            link: `/session/${roomId}`,
          });
          io.to(`user_${otherUserId}`).emit("waiting-user", {
            sessionId,
            roomId,
            message: `${userNameLabel} is waiting for you in session`,
          });
        }

        scheduleWaitingExpiration(roomId, io);
      }

      io.to(`session_${roomId}`).emit("user-joined", {
        userId,
        userName: userNameLabel,
        currentCount: existingCount + 1,
      });
    });

    socket.on("offer", ({ roomId, offer }) => {
      if (!roomId || !offer) return;
      socket.to(`session_${roomId}`).emit("offer", offer);
    });

    socket.on("answer", ({ roomId, answer }) => {
      if (!roomId || !answer) return;
      socket.to(`session_${roomId}`).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      if (!roomId || !candidate) return;
      socket.to(`session_${roomId}`).emit("ice-candidate", candidate);
    });

    socket.on("mute-audio", ({ roomId, userId, muted }) => {
      if (!roomId) return;
      socket.to(`session_${roomId}`).emit("mute-audio", { userId, muted });
    });

    socket.on("camera-toggle", ({ roomId, userId, enabled }) => {
      if (!roomId) return;
      socket.to(`session_${roomId}`).emit("camera-toggle", { userId, enabled });
    });

    socket.on("screen-share-start", ({ roomId, userId }) => {
      if (!roomId) return;
      socket.to(`session_${roomId}`).emit("screen-share-start", { userId });
    });

    socket.on("screen-share-stop", ({ roomId, userId }) => {
      if (!roomId) return;
      socket.to(`session_${roomId}`).emit("screen-share-stop", { userId });
    });

    socket.on("chat-message", ({ roomId, userId, userName, content }) => {
      if (!roomId || !content?.trim()) return;
      socket.to(`session_${roomId}`).emit("chat-message", {
        userId,
        userName,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      });
    });

    socket.on("end-session", async ({ roomId, userId }) => {
      if (!roomId) return;
      await cleanupMeetingRoom(roomId, io, "ended");
    });

    socket.on("disconnect", async () => {
      const rooms = Array.from(socket.rooms).filter((r) =>
        r.startsWith("session_"),
      );
      for (const roomId of rooms) {
        socket.to(roomId).emit("user-left", { userId: authenticatedUserId });

        const room = io.sockets.adapter.rooms.get(roomId);
        if (!room || room.size === 0) {
          await cleanupMeetingRoom(roomId.replace("session_", ""), io, "ended");
        }
      }
    });
  });
};

const startSessionScheduler = (io) => {
  const becomeStartable = async () => {
    const now = new Date();
    const readyWindowStart = new Date(now.getTime() - 60 * 60 * 1000);
    const sessions = await Session.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
      startNotificationSent: false,
    });

    for (const session of sessions) {
      const startTime = new Date(session.scheduledAt);
      const expiryTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      if (now > expiryTime) {
        session.status = "expired";
        await session.save();
        continue;
      }

      for (const recipient of session.users) {
        await createNotification({
          recipient,
          session: session._id,
          message: "Your session is ready to start. Join quickly.",
          link: session.sessionRoomId
            ? `/session/${session.sessionRoomId}`
            : "",
        });
        io.to(`user_${recipient.toString()}`).emit("session-ready", {
          sessionId: session._id,
          message: "Your session is ready to start. Join quickly.",
        });
      }

      session.startNotificationSent = true;
      await session.save();
    }
  };

  becomeStartable();
  setInterval(becomeStartable, 60 * 1000);
};

export { initSessionSocket, startSessionScheduler };
