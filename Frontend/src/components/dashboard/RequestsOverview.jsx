import { useEffect, useState } from "react";

function RequestsOverview() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // 👉 Replace with API later
        // const res = await axios.get("/api/requests");

        const mockData = [
          {
            _id: "1",
            fromUser: "John",
            skill: "React",
          },
          {
            _id: "2",
            fromUser: "Alex",
            skill: "Node",
          },
        ];

        setRequests(mockData);
      } catch (err) {
        console.error("Error fetching requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      {/* HEADER */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Requests Overview
      </h2>

      {/* LOADING */}
      {loading && <p className="text-sm text-gray-500">Loading requests...</p>}

      {/* EMPTY */}
      {!loading && requests.length === 0 && (
        <p className="text-sm text-gray-500">No requests available.</p>
      )}

      {/* LIST */}
      <div className="divide-y">
        {requests.map((req) => (
          <div key={req._id} className="flex items-center justify-between py-3">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>

              <p className="text-sm text-gray-700">
                <span className="font-medium">{req.fromUser}</span> wants{" "}
                <span className="font-medium">{req.skill}</span>
              </p>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex gap-3 text-sm">
              <button className="text-green-600 hover:underline">Accept</button>
              <button className="text-red-500 hover:underline">Reject</button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      {!loading && requests.length > 0 && (
        <p className="text-center text-blue-500 mt-4 text-sm cursor-pointer hover:underline">
          View All
        </p>
      )}
    </div>
  );
}

export default RequestsOverview;
