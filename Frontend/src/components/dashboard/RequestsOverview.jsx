import { useEffect, useState } from "react";
import { getReceivedRequests, respondRequest } from "../../api/request.api";

function RequestsOverview() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getReceivedRequests();
        setRequests(res.data || []);
      } catch (err) {
        console.error("Error fetching requests", err);
        setError("Unable to load requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleResponse = async (id, status) => {
    try {
      await respondRequest(id, status);
      setRequests((prev) => prev.filter((request) => request._id !== id));
    } catch (err) {
      console.error("Error updating request", err);
      alert("Could not update request.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Requests Overview
      </h2>

      {loading && <p className="text-sm text-gray-500">Loading requests...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && requests.length === 0 && (
        <p className="text-sm text-gray-500">No requests available.</p>
      )}

      <div className="divide-y">
        {requests.map((req) => (
          <div key={req._id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>

              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">
                    {req.sender?.name || "Unknown"}
                  </span>
                  {` wants ${req.skillWanted || "a skill"} and offers ${req.skillOffered || "a skill"}`}
                </p>
              </div>
            </div>

            <div className="flex gap-3 text-sm">
              <button
                onClick={() => handleResponse(req._id, "accepted")}
                className="text-green-600 hover:underline"
              >
                Accept
              </button>
              <button
                onClick={() => handleResponse(req._id, "rejected")}
                className="text-red-500 hover:underline"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && requests.length > 0 && (
        <p className="text-center text-blue-500 mt-4 text-sm cursor-pointer hover:underline">
          View All
        </p>
      )}
    </div>
  );
}

export default RequestsOverview;
