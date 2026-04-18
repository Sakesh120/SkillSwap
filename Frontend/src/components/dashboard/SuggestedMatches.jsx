import { useEffect, useState } from "react";
import { getMatches, sendSwapRequest } from "../../api/match.api";

function SuggestedMatches() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await getMatches();
        console.log("API Response:", res.data);
        console.log("Matches data:", res.data.matches);
        if (res.data.matches && res.data.matches.length > 0) {
          console.log("First user avatar:", res.data.matches[0].avatar);
        }
        setUsers(res.data.matches || []);
      } catch (err) {
        console.error("Failed to fetch matches", err);
        setError("Could not load matches.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleRequest = async (user) => {
    try {
      await sendSwapRequest({
        receiverId: user._id,
        skillOffered: user.skillsWanted?.[0] || "",
        skillWanted: user.skillsOffered?.[0] || "",
      });
      alert("Swap request sent successfully.");
    } catch (err) {
      console.error("Failed to send swap request", err);
      alert("Unable to send request. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Suggested Matches
      </h2>

      {loading && <p className="text-sm text-gray-500">Loading matches...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && users.length === 0 && (
        <p className="text-sm text-gray-500">No matches available right now.</p>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2">
        {!loading &&
          users.map((user) => (
            <div
              key={user._id}
              className="min-w-55 bg-gray-50 rounded-xl p-4 border hover:shadow-md hover:scale-[1.02] transition"
            >
              <div className="flex items-center gap-3 mb-3 cursor-pointer">
                <img
                  src={
                    user.avatar?.image
                      ? `http://localhost:3000${user.avatar.image}`
                      : "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(user.name) +
                        "&background=random"
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user.name) +
                      "&background=random";
                  }}
                />
                <h3 className="font-medium text-gray-800">{user.name}</h3>
              </div>

              <p className="text-xs text-gray-600">
                <span className="font-medium">Offers:</span>{" "}
                {(user.skillsOffered || []).join(", ")}
              </p>

              <p className="text-xs text-gray-600 mb-3">
                <span className="font-medium">Wants:</span>{" "}
                {(user.skillsWanted || []).join(", ")}
              </p>

              <button
                onClick={() => handleRequest(user)}
                className="w-full text-sm bg-blue-500 text-white py-1.5 rounded-lg hover:bg-blue-600 transition"
              >
                Request Swap
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SuggestedMatches;
