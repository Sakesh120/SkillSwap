import { useEffect, useState } from "react";

function SuggestedMatches() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // 🔌 Replace this with real API later
        // const res = await axios.get("/api/matches");

        const mockData = [
          {
            _id: "1",
            name: "Sam",
            avatar: null,
            teach: ["React"],
            learn: ["UI/UX"],
          },
          {
            _id: "2",
            name: "Eli",
            avatar: null,
            teach: ["JavaScript"],
            learn: ["Python"],
          },
          {
            _id: "3",
            name: "Holdar",
            avatar: null,
            teach: ["UI/UX"],
            learn: ["React"],
          },
          {
            _id: "4",
            name: "Max",
            avatar: null,
            teach: ["Node"],
            learn: ["React"],
          },
        ];

        setUsers(mockData);
      } catch (err) {
        console.error("Failed to fetch matches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleRequest = (id) => {
    console.log("Request sent to:", id);

    // 👉 Future API
    // await axios.post(`/api/request/${id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      {/* HEADER */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Suggested Matches
      </h2>

      {/* LOADING */}
      {loading && <p className="text-sm text-gray-500">Loading matches...</p>}

      {/* EMPTY */}
      {!loading && users.length === 0 && (
        <p className="text-sm text-gray-500">No matches available right now.</p>
      )}

      {/* MATCH CARDS */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {!loading &&
          users.map((user) => (
            <div
              key={user._id}
              className="min-w-55 bg-gray-50 rounded-xl p-4 border hover:shadow-md hover:scale-[1.02] transition"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={user.avatar || "https://via.placeholder.com/40"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h3 className="font-medium text-gray-800">{user.name}</h3>
              </div>

              {/* Skills */}
              <p className="text-xs text-gray-600">
                <span className="font-medium">Teach:</span>{" "}
                {user.teach.join(", ")}
              </p>

              <p className="text-xs text-gray-600 mb-3">
                <span className="font-medium">Learn:</span>{" "}
                {user.learn.join(", ")}
              </p>

              {/* BUTTON */}
              <button
                onClick={() => handleRequest(user._id)}
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
