import Session from "../model/session.model.js";
import SessionMeeting from "../model/sessionMeeting.model.js";
import userModel from "../model/user.model.js";
import Notification from "../model/notification.model.js";

/// GET user session
export const getSession = async (req, res) => {
  try {
    const session = await Session.find({
      users: req.user,
    }).populate("users", "name email");

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET specific session by ID
export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId).populate(
      "users",
      "name email",
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.some((user) => user._id.toString() === req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SCHEDULE SESSION
export const scheduleSession = async (req, res) => {
  try {
    const { sessionId, scheduledAt } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only participants can schedule
    if (!session.users.some((user) => user.toString() === req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.scheduledAt = scheduledAt;
    session.status = "scheduled";
    session.startNotificationSent = false;
    await session.save();
    res.json({ message: "Session scheduled", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SESSION PLATFORM
export const updateSessionPlatform = async (req, res) => {
  try {
    const { sessionId, platform } = req.body;
    const allowedPlatforms = ["ZOOM", "GMEET", "WHATSAPP CALL", "SKILLSWAP"];

    if (!platform || !allowedPlatforms.includes(platform)) {
      return res.status(400).json({ message: "Invalid platform selected" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.some((user) => user.toString() === req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (session.status === "completed") {
      return res
        .status(400)
        .json({ message: "Platform cannot be changed after completion" });
    }

    session.platform = platform;
    await session.save();

    res.json({ message: "Platform updated", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSessionRoom = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.some((user) => user.toString() === req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (session.status === "expired" || session.status === "abandoned") {
      return res.status(400).json({ message: "This session has expired." });
    }

    if (session.status !== "scheduled" && session.status !== "live") {
      return res
        .status(400)
        .json({ message: "Session is not available for meeting start." });
    }

    if (session.platform !== "SKILLSWAP") {
      return res
        .status(400)
        .json({ message: "Session platform is not SkillSwap." });
    }

    const scheduledAt = session.scheduledAt
      ? new Date(session.scheduledAt)
      : null;
    const now = new Date();
    if (!scheduledAt || now < scheduledAt) {
      return res.status(400).json({ message: "Session has not started yet." });
    }

    const lateDeadline = new Date(scheduledAt.getTime() + 60 * 60 * 1000);
    if (now > lateDeadline) {
      session.status = "expired";
      await session.save();
      return res
        .status(400)
        .json({ message: "You got late. Session has been discarded." });
    }

    const roomId =
      session.sessionRoomId ||
      `session_${Math.floor(Math.random() * 10000000)}`;
    session.sessionRoomId = roomId;
    session.status = "live";
    await session.save();

    // Create a persistent notification for the other participant so they
    // see the session has been started even if they are not currently
    // connected to sockets.
    const otherUserId = session.users.find((u) => u.toString() !== req.user);
    if (otherUserId) {
      try {
        await Notification.create({
          recipient: otherUserId,
          sender: req.user,
          session: session._id,
          message: `${req.user} started the session. Join now.`,
          link: `/session/${roomId}`,
        });
        // also emit a socket event to the other user if possible
        const io = req.app?.get("io");
        if (io) {
          io.to(`user_${otherUserId}`).emit("session-started", {
            sessionId: session._id,
            roomId,
            message: "Your partner started the session. Join now.",
          });
        }
      } catch (e) {
        // don't block room creation if notification fails
        console.warn("Failed to create start-notification", e.message);
      }
    }

    await SessionMeeting.findOneAndUpdate(
      { roomId, sessionId: session._id },
      {
        roomId,
        sessionId: session._id,
        hostUser: req.user,
        joinedUser: session.users.find((user) => user.toString() !== req.user),
        status: "waiting",
        hostJoined: true,
        waitingStartedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json({ message: "Meeting room created", roomId, session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessionByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const meeting = await SessionMeeting.findOne({ roomId });
    if (!meeting) {
      return res.status(404).json({ message: "Meeting room not found" });
    }

    const session = await Session.findById(meeting.sessionId).populate(
      "users",
      "name email avatar",
    );
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.users.some((user) => user._id.toString() === req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ meeting, session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

///// SESSION COMPLETION
export const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only participants can complete
    if (!session.users.some((user) => user.toString() === req.user)) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    //Must be scheduled
    if (session.status != "scheduled") {
      return res.status(400).json({
        message: "Session must be scheduled first",
      });
    }

    // Prevent  the duplicate completion by the same user
    if (session.completeBy.some((user) => user.toString() === req.user)) {
      return res.status(400).json({
        message: "You already marked this session completed",
      });
    }

    // Add current user to
    session.completeBy.push(req.user);

    // If both users completed -> finalize
    if (session.completeBy.length === 2) {
      // Reward both users
      for (let userId of session.users) {
        const user = await userModel.findById(userId);
        user.credits += 20;
        await user.save();
      }
      session.status = "completed";
    }

    await session.save();

    res.json({
      message:
        session.status === "completed"
          ? "Session completed successfully"
          : "Marked as completed (waiting for other user)",
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
