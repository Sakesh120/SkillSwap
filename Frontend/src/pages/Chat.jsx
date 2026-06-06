import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { getChatHistory, getSessionById } from "../api/chat.api";

const CHAT_SERVER_URL = "http://localhost:3000";

function Chat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  const partner = useMemo(() => {
    if (!session || !user) return null;
    return session.users.find((u) => u._id !== user._id) || null;
  }, [session, user]);

  useEffect(() => {
    const loadChat = async () => {
      try {
        setLoading(true);
        const [sessionRes, historyRes] = await Promise.all([
          getSessionById(sessionId),
          getChatHistory(sessionId),
        ]);
        setSession(sessionRes.data);
        setMessages(historyRes.data.messages || []);
      } catch (err) {
        console.error("Chat load error", err);
        setError(
          err.response?.data?.message || "Unable to load this chat session.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [sessionId]);

  useEffect(() => {
    if (!user || !sessionId) return;

    const socket = io(CHAT_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", { sessionId, userId: user._id });
    });

    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("connect_error", (reason) => {
      console.error("Socket connect error", reason);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, user]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !socketRef.current || !user) return;

    const payload = {
      sessionId,
      senderId: user._id,
      content: messageText.trim(),
    };

    socketRef.current.emit("sendMessage", payload);
    setMessageText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 mt-[10vh]">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Session chat
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Chat with {partner?.name || "your partner"} about your scheduled
              session.
            </p>
          </div>
          {session?.status && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {session.status}
            </span>
          )}
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            Loading chat...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <div
              ref={scrollRef}
              className="max-h-130 space-y-4 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-4"
            >
              {messages.length === 0 ? (
                <div className="text-center text-slate-500">
                  No chat history yet. Send the first message.
                </div>
              ) : (
                messages.map((message) => {
                  const isMine = message.sender?._id === user?._id;
                  return (
                    <div
                      key={message._id}
                      className={`flex flex-col gap-2 ${
                        isMine ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                          isMine
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-900"
                        }`}
                      >
                        <div className="font-medium">
                          {isMine ? "You" : message.sender?.name || "Partner"}
                        </div>
                        <p className="mt-1 wrap-break-words">
                          {message.content}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <textarea
                rows={2}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                className="min-h-30 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-3xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!messageText.trim()}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
