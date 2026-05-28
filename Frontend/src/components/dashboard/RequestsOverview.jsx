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
        setRequests(
          (res.data || []).filter((request) => request.status === "pending"),
        );
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
    <div className="bg-white/20 backdrop-blur-lg border-white/30  rounded-2xl shadow-sm border p-6">
      <h2 className="text-fluid-h3 mb-4 font-semibold text-gray-800">
        Requests Overview
      </h2>

      {loading && (
        <p className="text-fluid-p text-gray-500">Loading requests...</p>
      )}
      {error && <p className="text-fluid-p text-red-500">{error}</p>}

      {!loading && requests.length === 0 && (
        <p className="text-fluid-p text-gray-500">No requests available.</p>
      )}

      <div className="divide-y">
        {requests.map((req) => (
          <div
            key={req._id}
            className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>

              <div>
                <p className="text-fluid-p text-gray-700">
                  <span className="font-medium">
                    {req.sender?.name || "Unknown"}
                  </span>
                  {` wants ${req.skillWanted || "a skill"} and offers ${req.skillOffered || "a skill"}`}
                </p>
              </div>
            </div>

            <div className="text-fluid-label flex gap-3 sm:shrink-0">
              <button
                onClick={() => handleResponse(req._id, "accepted")}
                className="cursor-pointer text-green-800 hover:underline"
              >
                Accept
              </button>
              <button
                onClick={() => handleResponse(req._id, "rejected")}
                className="cursor-pointer text-red-900 hover:underline"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && requests.length > 0 && (
        <p className="text-fluid-label mt-4 cursor-pointer text-center text-blue-500 hover:underline">
          View All
        </p>
      )}
    </div>
  );
}

export default RequestsOverview;
