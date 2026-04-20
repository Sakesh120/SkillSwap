import { useEffect, useState } from "react";
import { getActivity } from "../../api/activity.api";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await getActivity();
        setActivities(res.data || []);
      } catch (err) {
        console.error("Error fetching activity", err);
        setError("Unable to load activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="bg-white/20 backdrop-blur-lg border-white/30  rounded-2xl shadow-sm border p-6">
      <h2 className="text-fluid-h3 mb-4 font-semibold text-gray-800">Activity</h2>

      {loading && <p className="text-fluid-p text-gray-500">Loading activity...</p>}
      {error && <p className="text-fluid-p text-red-500">{error}</p>}

      {!loading && activities.length === 0 && (
        <p className="text-fluid-p text-gray-500">No recent activity.</p>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {activities.map((item) => (
          <div key={item._id} className="flex items-start gap-3 rounded-xl bg-white/35 p-4">
            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-fluid-p text-gray-700">{item.text}</p>
              <p className="text-fluid-caption text-gray-400">
                {new Date(item.time).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activity;
