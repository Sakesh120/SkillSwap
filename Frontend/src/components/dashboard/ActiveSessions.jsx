import { useEffect, useState } from "react";
import { getSessions } from "../../api/session.api";
import { useAuth } from "../../context/AuthContext";

function ActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getSessions();
        setSessions(res.data || []);
      } catch (err) {
        console.error("Error fetching sessions", err);
        setError("Unable to load sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getPartnerName = (session) => {
    if (!user || !session.users) return "Partner";
    const partner = session.users.find((u) => u._id !== user._id);
    return partner?.name || "Partner";
  };

  const getTopic = (session) => {
    return session.skillRequested || session.skillsOffered || "Skill session";
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg border-white/30  rounded-2xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Active Sessions
      </h2>

      {loading && <p className="text-sm text-gray-500">Loading sessions...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && sessions.length === 0 && (
        <p className="text-sm text-gray-500">No active sessions right now.</p>
      )}

      <div className="divide-y">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>

              <div>
                <p className="text-sm font-medium text-gray-800">
                  {getPartnerName(session)}
                </p>
                <p className="text-xs text-gray-500">{getTopic(session)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">
                Chat
              </button>
              <button className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition">
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveSessions;
