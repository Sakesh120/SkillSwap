import { useEffect, useState } from "react";

function ActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // 👉 Replace later with API
        // const res = await axios.get("/api/sessions");

        const mockData = [
          {
            _id: "1",
            user: "Emma",
            topic: "React & Design",
          },
          {
            _id: "2",
            user: "Mike",
            topic: "Node Basics",
          },
        ];

        setSessions(mockData);
      } catch (err) {
        console.error("Error fetching sessions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      {/* HEADER */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Active Sessions
      </h2>

      {/* LOADING */}
      {loading && <p className="text-sm text-gray-500">Loading sessions...</p>}

      {/* EMPTY */}
      {!loading && sessions.length === 0 && (
        <p className="text-sm text-gray-500">No active sessions right now.</p>
      )}

      {/* LIST */}
      <div className="divide-y">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="flex items-center justify-between py-3"
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>

              <div>
                <p className="text-sm font-medium text-gray-800">
                  {session.user}
                </p>
                <p className="text-xs text-gray-500">{session.topic}</p>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex gap-2">
              <button className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">
                Chat
              </button>

              <button className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition">
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveSessions;
