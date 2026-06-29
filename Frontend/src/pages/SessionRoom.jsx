import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { getSessionByRoomId } from "../api/session.api";
import WorkFlow from "../components/WorkFlow";

import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaCommentDots,
  FaTimes,
} from "react-icons/fa";

const SOCKET_SERVER_URL = "http://localhost:3000";

function SessionRoom() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(
    "Connecting to meeting...",
  );
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [peerConnected, setPeerConnected] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const offerCreatedRef = useRef(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const partner = useMemo(() => {
    if (!session || !user) return null;
    return session.users.find((u) => u._id !== user._id) || null;
  }, [session, user]);

  const isOfferer = useMemo(() => {
    if (!session || !user || !partner) return false;
    return String(user._id) < String(partner._id);
  }, [session, user, partner]);

  const stopLocalStream = () => {
    if (!localStream) return;
    localStream.getTracks().forEach((track) => track.stop());
  };

  const cleanupPeerConnection = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
  };

  const setupLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Unable to access local media", err);

      setError(
        "Could not access camera and microphone. Please allow permissions and refresh.",
      );
    }
  };

  useEffect(() => {
    if (!user || !roomId) return;

    const loadRoom = async () => {
      try {
        setLoading(true);

        const response = await getSessionByRoomId(roomId);

        setSession(response.data.session);
        setMeeting(response.data.meeting);
        setError(null);
      } catch (err) {
        console.error("Room load error", err);

        setError(
          err.response?.data?.message ||
            "Unable to load the session meeting room.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId, user]);

  useEffect(() => {
    if (!user || !session) return;

    let mounted = true;

    const createPeerConnection = () => {
      const pc = new RTCPeerConnection();

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit("ice-candidate", {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        if (!mounted) return;

        const [remoteStream] = event.streams;

        setRemoteStream(remoteStream);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }

        setPeerConnected(true);
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setStatusMessage("Connected with your partner.");
          setPeerConnected(true);
        } else if (pc.connectionState === "disconnected") {
          setStatusMessage("Partner disconnected.");
        }
      };

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
      }

      return pc;
    };

    const ensurePeerConnection = () => {
      if (!pcRef.current) {
        pcRef.current = createPeerConnection();
      }

      return pcRef.current;
    };

    const socket = io(SOCKET_SERVER_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);

      setStatusMessage("Connected to meeting server. Joining room...");

      socket.emit("join-room", {
        roomId,
        userId: user._id,
        sessionId: session._id,
        userName: user.name || "Participant",
      });
    });

    socket.on("waiting-user", (payload) => {
      setStatusMessage(
        payload?.message || "Waiting for your partner to join...",
      );
    });

    socket.on("user-joined", async ({ userId, userName, currentCount }) => {
      setParticipants((current) => {
        const next = [...current];

        if (!next.some((u) => u.userId === userId)) {
          next.push({ userId, userName });
        }

        return next;
      });

      if (currentCount === 2 && !offerCreatedRef.current) {
        const pc = ensurePeerConnection();

        if (isOfferer) {
          try {
            const offer = await pc.createOffer();

            await pc.setLocalDescription(offer);

            socket.emit("offer", { roomId, offer });

            offerCreatedRef.current = true;

            setStatusMessage("Creating call offer...");
          } catch (err) {
            console.error("Offer creation failed", err);

            setError("Unable to create the WebRTC offer.");
          }
        }
      }
    });

    socket.on("offer", async (offer) => {
      try {
        const pc = ensurePeerConnection();

        await pc.setRemoteDescription(offer);

        const answer = await pc.createAnswer();

        await pc.setLocalDescription(answer);

        socket.emit("answer", { roomId, answer });

        setStatusMessage("Answering call...");
      } catch (err) {
        console.error("Offer handling failed", err);

        setError("Unable to establish the call.");
      }
    });

    socket.on("answer", async (answer) => {
      try {
        if (!pcRef.current) return;

        await pcRef.current.setRemoteDescription(answer);

        setStatusMessage("Call connected.");
      } catch (err) {
        console.error("Answer handling failed", err);
      }
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        if (!pcRef.current) return;

        await pcRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.error("Failed to add ICE candidate", err);
      }
    });

    socket.on("chat-message", (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    socket.on("session-ended", ({ reason }) => {
      setStatusMessage(reason || "The session has ended.");

      setPeerConnected(false);

      cleanupPeerConnection();
      stopLocalStream();

      setTimeout(() => navigate("/my-sessions"), 1200);
    });

    socket.on("user-left", () => {
      setStatusMessage("Your partner left the session.");

      setPeerConnected(false);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);

      setStatusMessage("Disconnected from meeting server.");
    });

    socket.on("connect_error", (reason) => {
      console.error("Socket connect error", reason);

      setError("Unable to connect to the meeting server.");
    });

    return () => {
      mounted = false;

      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      cleanupPeerConnection();
      stopLocalStream();
    };
  }, [roomId, session, user, localStream, isOfferer]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    const attachTracksAndMaybeOffer = async () => {
      if (!localStream || !pcRef.current || !socketRef.current) return;

      try {
        const senders = pcRef.current
          .getSenders()
          .map((s) => s.track)
          .filter(Boolean);

        localStream.getTracks().forEach((track) => {
          if (!senders.includes(track)) {
            try {
              pcRef.current.addTrack(track, localStream);
            } catch (err) {}
          }
        });

        if (isOfferer && !offerCreatedRef.current) {
          const offer = await pcRef.current.createOffer();

          await pcRef.current.setLocalDescription(offer);

          socketRef.current.emit("offer", { roomId, offer });

          offerCreatedRef.current = true;

          setStatusMessage("Creating call offer...");
        }
      } catch (err) {
        console.error("Error attaching local tracks / creating offer", err);
      }
    };

    attachTracksAndMaybeOffer();
  }, [localStream, isOfferer, roomId]);

  useEffect(() => {
    if (roomId && !localStream && !error) {
      setupLocalMedia();
    }
  }, [roomId, localStream, error]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    if (!localStream) return;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    });
  };

  const toggleCamera = () => {
    if (!localStream) return;

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setCameraOn(track.enabled);
    });
  };

  const endSession = async () => {
    if (socketRef.current) {
      socketRef.current.emit("end-session", {
        roomId,
        userId: user?._id,
      });
    }

    cleanupPeerConnection();
    stopLocalStream();

    navigate("/my-sessions");
  };

  const sendChatMessage = () => {
    if (!messageText.trim() || !socketRef.current || !user) return;

    const payload = {
      roomId,
      userId: user._id,
      userName: user.name || "You",
      content: messageText.trim(),
    };

    socketRef.current.emit("chat-message", payload);

    setChatMessages((prev) => [
      ...prev,
      {
        userId: user._id,
        userName: "You",
        content: messageText.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);

    setMessageText("");
  };

  useEffect(() => {
    if (localStream && remoteStream) {
      setPeerConnected(true);
    }
  }, [localStream, remoteStream]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 mt-[10vh]">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 text-center">
          <p>Loading meeting room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 mt-[10vh]">
        <div className="mx-auto max-w-4xl rounded-3xl bg-red-50 p-8 text-center">
          <p>{error}</p>

          <button onClick={() => navigate("/my-sessions")}>
            Back to sessions
          </button>
        </div>
      </div>
    );
  }

  // WAIT FOR PART 2 → RETURN UI
  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      {/* ================= FULLSCREEN REMOTE VIDEO ================= */}
      <div className="absolute inset-0 z-0">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-slate-900"
        />
      </div>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* ================= TOP HEADER ================= */}
      <div className="absolute top-0 left-0 right-0 z-40 px-3 md:px-6 py-4">
        <div
          className="
          flex justify-between items-center
          rounded-2xl
          bg-black/30
          backdrop-blur-lg
          border border-white/10
          px-4 md:px-6 py-3
        "
        >
          {/* Left */}
          <div>
            <h1 className="text-lg md:text-2xl font-semibold text-white">
              SkillSwap Session
            </h1>

            <p className="text-xs md:text-sm text-gray-300 mt-1">
              {session?.skillRequested ||
                session?.skillsOffered ||
                "Skill Session"}

              {partner ? ` • with ${partner.name}` : ""}
            </p>
          </div>

          {/* Right */}
          <div className="hidden md:block text-right">
            <p className="text-sm text-white">
              {meeting?.status || session?.status || "Live"}
            </p>

            <p className="text-xs text-gray-300 mt-1">{statusMessage}</p>
          </div>
        </div>
      </div>

      {/* ================= WAITING STATE ================= */}
      {!peerConnected && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="
            rounded-2xl
            bg-black/40
            backdrop-blur-md
            px-6 py-4
            border border-white/10
          "
          >
            <p className="text-white text-sm md:text-base">
              Waiting for partner to join...
            </p>
          </div>
        </div>
      )}

      {/* ================= LOCAL VIDEO FLOATING ================= */}
      <div
        className="
        absolute
        bottom-24
        right-3
        md:right-6
        z-50

        w-28 h-28
        sm:w-36 sm:h-36
        md:w-50 md:h-50

        rounded-2xl
        overflow-hidden
        border-2 border-white/20
        shadow-2xl
        bg-black
      "
      >
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        <div
          className="
          absolute bottom-2 left-2
          bg-black/50
          px-2 py-1
          rounded
          text-[11px]
          text-white
        "
        >
          You
        </div>
      </div>

      {/* ================= CHAT POPUP ================= */}
      {showMobileChat && (
        <div
          className="
          absolute
          z-50

          bottom-24
          left-3
          md:left-auto
          md:right-6

          w-[95vw]
          md:w-95

          h-107.5

          rounded-2xl
          bg-black/40
          backdrop-blur-xl
          border border-white/10

          flex flex-col
          overflow-hidden
        "
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-white font-semibold">Chat</h2>

            <button
              onClick={() => setShowMobileChat(false)}
              className="text-white text-lg"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <p className="text-sm text-gray-300">No messages yet</p>
            ) : (
              chatMessages.map((message, index) => {
                const isMine = message.userId === user?._id;

                return (
                  <div
                    key={`${message.createdAt}-${index}`}
                    className={`
                    max-w-[80%]
                    rounded-xl
                    px-3 py-2
                    text-sm

                    ${
                      isMine
                        ? "ml-auto bg-blue-600 text-white"
                        : "bg-white/15 text-white"
                    }
                  `}
                  >
                    <div className="font-medium text-xs mb-1">
                      {isMine ? "You" : message.userName || "Partner"}
                    </div>

                    <p className="wrap-break-words">{message.content}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex gap-2">
            <textarea
              rows={2}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type message..."
              className="
              flex-1
              resize-none
              rounded-xl
              bg-white/10
              text-white
              px-3 py-2
              outline-none
              border border-white/10
            "
            />

            <button
              onClick={sendChatMessage}
              disabled={!messageText.trim()}
              className="
              bg-blue-600
              px-4
              rounded-xl
              text-white
              disabled:opacity-50
            "
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* ================= BOTTOM CONTROLS ================= */}
      <div className="absolute bottom-0 left-0 right-0 z-40 px-4 py-5">
        <div
          className="
          mx-auto
          w-fit

          flex items-center gap-3 md:gap-4

          rounded-2xl
          bg-black/30
          backdrop-blur-lg
          border border-white/10

          px-4 md:px-6
          py-3
        "
        >
          {/* MIC */}
          <button
            onClick={toggleMute}
            className={`
            w-12 h-12 rounded-full
            flex items-center justify-center
            transition

            ${
              micOn
                ? "bg-slate-700 text-white hover:bg-slate-600"
                : "bg-red-600 text-white hover:bg-red-500"
            }
          `}
          >
            {micOn ? (
              <FaMicrophone size={18} />
            ) : (
              <FaMicrophoneSlash size={18} />
            )}
          </button>

          {/* CAMERA */}
          <button
            onClick={toggleCamera}
            className={`
            w-12 h-12 rounded-full
            flex items-center justify-center
            transition

            ${
              cameraOn
                ? "bg-slate-700 text-white hover:bg-slate-600"
                : "bg-red-600 text-white hover:bg-red-500"
            }
          `}
          >
            {cameraOn ? <FaVideo size={18} /> : <FaVideoSlash size={18} />}
          </button>

          {/* CHAT */}
          <button
            onClick={() => setShowMobileChat(!showMobileChat)}
            className="
            w-12 h-12 rounded-full
            bg-blue-600
            hover:bg-blue-500
            text-white
            flex items-center justify-center
          "
          >
            <FaCommentDots size={18} />
          </button>

          {/* END SESSION */}
          <button
            onClick={endSession}
            className="
            w-14 h-14 rounded-full
            bg-red-600
            hover:bg-red-500
            text-white
            flex items-center justify-center
          "
          >
            <FaPhoneSlash size={20} />
          </button>
        </div>
      </div>

      {/* ================= SIDE STATUS ================= */}
      <div className="absolute left-4 bottom-24 z-30 hidden lg:block">
        <div
          className="
          rounded-xl
          bg-black/30
          backdrop-blur-md
          border border-white/10
          px-4 py-3
        "
        >
          <p className="text-xs text-gray-300">Room: {roomId}</p>

          <p className="text-xs text-gray-300 mt-1">
            Server: {socketConnected ? "Online" : "Offline"}
          </p>

          <p className="text-xs text-gray-300 mt-1">
            Call: {peerConnected ? "Connected" : "Waiting"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SessionRoom;
