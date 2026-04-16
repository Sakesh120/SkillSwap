import { useEffect, useState } from "react";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // 👉 Replace with API later
        // const res = await axios.get("/api/activity");

        const mockData = [
          {
            _id: "1",
            text: "You completed a swap with Emma",
            time: "2h ago",
          },
          {
            _id: "2",
            text: "John requested a React session",
            time: "5h ago",
          },
          {
            _id: "3",
            text: "You joined a Node.js session",
            time: "1d ago",
          },
        ];

        setActivities(mockData);
      } catch (err) {
        console.error("Error fetching activity", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      {/* HEADER */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity</h2>

      {/* LOADING */}
      {loading && <p className="text-sm text-gray-500">Loading activity...</p>}

      {/* EMPTY */}
      {!loading && activities.length === 0 && (
        <p className="text-sm text-gray-500">No recent activity.</p>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item._id} className="flex items-start gap-3">
            {/* DOT */}
            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>

            {/* TEXT */}
            <div>
              <p className="text-sm text-gray-700">{item.text}</p>
              <p className="text-xs text-gray-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activity;
