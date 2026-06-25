import { useEffect, useMemo, useRef, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { getSessionByRoomId } from "../api/session.api";
import WorkFlow from "../components/WorkFlow";

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
  const [showChatPanel, setShowChatPanel] = useState(false);
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
      // navigate back to sessions after brief message
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

  // Ensure that if the peer connection was created before we obtained
  // the local media, we attach the local tracks to the existing
  // RTCPeerConnection and (for the offerer) create the offer.
  useEffect(() => {
    const attachTracksAndMaybeOffer = async () => {
      if (!localStream || !pcRef.current || !socketRef.current) return;

      try {
        // Add tracks if they're not already present
        const senders = pcRef.current
          .getSenders()
          .map((s) => s.track)
          .filter(Boolean);
        localStream.getTracks().forEach((track) => {
          if (!senders.includes(track)) {
            try {
              pcRef.current.addTrack(track, localStream);
            } catch (err) {
              // addTrack can throw if connection is closed — ignore silently
            }
          }
        });

        // If this client should be the offerer but no offer was created yet,
        // create and send one now (handles case where offer was attempted
        // before local media was ready).
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
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 mt-[10vh]">
        <div className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl text-center">
          <p className="text-lg text-slate-600">Loading meeting room…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 mt-[10vh]">
        <div className="mx-auto w-full max-w-4xl rounded-3xl border border-red-200 bg-red-50 p-8 shadow-xl text-center">
          <p className="text-lg text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/my-sessions")}
            className="mt-6 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 mt-[10vh]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              SkillSwap meeting
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {session?.skillRequested ||
                session?.skillsOffered ||
                "Skill session"}
              {partner ? ` with ${partner.name}` : ""}.
            </p>
          </div>
          <div className="space-y-2 text-right">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {session?.status || "live"}
            </span>
            <p className="text-sm text-slate-500">{statusMessage}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              {/* Partner (larger) */}
              <div className="rounded-3xl bg-black p-2 order-2 xl:order-1">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="h-96 w-full rounded-3xl object-cover bg-slate-900"
                />
                <p className="mt-2 text-sm text-slate-400">Partner camera</p>
              </div>

              {/* Local (smaller) */}
              <div className="rounded-3xl bg-black p-2 order-1 xl:order-2">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-44 w-full rounded-3xl object-cover bg-slate-900"
                />
                <p className="mt-2 text-sm text-slate-400">Your camera</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleMute}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  micOn
                    ? "bg-slate-700 text-white hover:bg-slate-800"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {micOn ? "Mute" : "Unmute"}
              </button>
              <button
                type="button"
                onClick={toggleCamera}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  cameraOn
                    ? "bg-slate-700 text-white hover:bg-slate-800"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {cameraOn ? "Stop camera" : "Start camera"}
              </button>
              <button
                type="button"
                onClick={endSession}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                End session
              </button>
            </div>

            {/* Mobile chat toggle button (small screens) */}
            <div className="block lg:hidden">
              <button
                type="button"
                onClick={() => setShowMobileChat(true)}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                Open chat
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Chat
              </h2>
              <div className="space-y-3 max-h-80 overflow-y-auto pb-2">
                {chatMessages.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Send a note to your partner while you wait.
                  </p>
                ) : (
                  chatMessages.map((message, index) => {
                    const isMine = message.userId === user?._id;
                    return (
                      <div
                        key={`${message.createdAt}-${index}`}
                        className={`rounded-3xl px-4 py-3 text-sm shadow-sm ${
                          isMine
                            ? "bg-blue-600 text-white self-end"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        <div className="font-medium">
                          {isMine ? "You" : message.userName || "Partner"}
                        </div>
                        <p className="mt-1 whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <span className="text-xs text-slate-400">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <textarea
                  rows={2}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-24 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  placeholder="Type a message..."
                />
                <button
                  type="button"
                  onClick={sendChatMessage}
                  disabled={!messageText.trim()}
                  className="rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Meeting details
              </h2>
              <p className="mt-2 text-sm text-slate-500">Room ID: {roomId}</p>
              <p className="mt-2 text-sm text-slate-500">
                Partner: {partner?.name || partner?.email || "Pending"}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                This session is using the internal SkillSwap meeting experience.
                Keep this browser tab open while the session is live.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-700">
                Session status: {meeting?.status || session?.status}
              </p>
              <p className="text-sm text-slate-700">
                Server connection: {socketConnected ? "online" : "offline"}
              </p>
              <p className="text-sm text-slate-700">
                Call status:{" "}
                {peerConnected ? "Connected" : "Waiting for partner"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <WorkFlow />
    </div>
  );
}

export default SessionRoom;
