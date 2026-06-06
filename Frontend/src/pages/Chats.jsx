import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessions } from "../api/session.api";
import { useAuth } from "../context/AuthContext";

function Chats() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const response = await getSessions();
        setSessions(response.data || []);
      } catch (err) {
        console.error("Unable to load chats", err);
        setError("Unable to load your chat sessions.");
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const chatSessions = useMemo(
    () => (sessions || []).filter((session) => session.status !== "completed"),
    [sessions],
  );

  const getPartnerName = (session) => {
    if (!user || !session.users) return "Partner";
    const partner = session.users.find((u) => u._id !== user._id);
    return partner?.name || "Partner";
  };

  const getTopic = (session) =>
    session.skillRequested || session.skillsOffered || "Skill session";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
              Session chats
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Chat history and active conversations
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to dashboard
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            Loading chats...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            {error}
          </div>
        ) : chatSessions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            No active chat sessions yet.
          </div>
        ) : (
          <div className="space-y-4">
            {chatSessions.map((session) => (
              <div
                key={session._id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {getPartnerName(session)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {getTopic(session)}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {session.status}
                    {session.scheduledAt
                      ? ` • ${new Date(session.scheduledAt).toLocaleString()}`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/chat/${session._id}`)}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Open chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chats;
