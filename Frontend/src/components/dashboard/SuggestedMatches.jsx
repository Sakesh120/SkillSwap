import { useEffect, useState, useRef  } from "react";
import { getMatches, sendSwapRequest } from "../../api/match.api";
import { useNavigate } from "react-router-dom";


function SuggestedMatches() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

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

  const getRatingDisplay = (averageRating) => {
    const rating = averageRating || 0;
    let label = "";
    let stars = "";

    if (rating === 0) {
      label = "Fresher";
      stars = "⭐".repeat(0) || "✨";
    } else if (rating >= 1 && rating <= 2) {
      label = "Beginner";
      stars = "⭐".repeat(Math.ceil(rating));
    } else if (rating >= 3 && rating <= 4) {
      label = "Professional";
      stars = "⭐".repeat(Math.ceil(rating));
    } else if (rating === 5) {
      label = "Expert";
      stars = "⭐".repeat(5);
    }

    return { label, stars };
  };

  return (
   <div className="h-max overflow-y-auto rounded-2xl border border-white/30 bg-white/20 p-6 shadow-sm backdrop-blur-lg no-scrollbar">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">
    Suggested Matches
  </h2>

  {loading && <p className="text-sm text-gray-500">Loading matches...</p>}
  {error && <p className="text-sm text-red-500">{error}</p>}

  {!loading && users.length === 0 && (
    <p className="text-sm text-gray-500">No matches available right now.</p>
  )}

  {/* Cards Container with Scroll Buttons */}
  <div className="flex flex-col gap-4">

  {/* Cards Container */}
  <div
    ref={containerRef}
    className="grid grid-flow-col auto-cols-[minmax(240px,1fr)] grid-rows-1 gap-4 overflow-x-auto pb-2 no-scrollbar sm:auto-cols-[280px] xl:auto-cols-[320px] 2xl:grid-rows-2"
    style={{ scrollSnapType: "x mandatory" }}
  >
  
  {!loading &&
    users.map((user) => (
      <div
        key={user._id}
        onClick={() => navigate(`/profile/${user._id}`)}
        className="cursor-pointer rounded-2xl border border-white/30 bg-white/20 p-4 shadow-sm backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        style={{ scrollSnapAlign: "start" }}
      >
        {/* User Info */}
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
            className="h-12 w-12 rounded-full border object-cover"
          />
          <h3 className="font-medium text-gray-800 truncate">
            {user.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="mb-3 text-sm text-gray-700 flex items-center gap-1 flex-wrap">
          {getRatingDisplay(user.averageRating).stars || "✨"}
          <span className="text-gray-600">
            {user.averageRating ? user.averageRating.toFixed(1) : "0"}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            {getRatingDisplay(user.averageRating).label}
          </span>
        </div>

        {/* Skills */}
        <p className="text-xs text-gray-600 line-clamp-2">
          <span className="font-medium">Offers:</span>{" "}
          {(user.skillsOffered || []).join(", ")}
        </p>

        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          <span className="font-medium">Wants:</span>{" "}
          {(user.skillsWanted || []).join(", ")}
        </p>

        {/* Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleRequest(user);
          }}
          className="w-full text-sm bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Request Swap
        </button>
      </div>
    ))}
  </div>


{/* Buttons */}
<div className="flex justify-center gap-4 mt-2">
  {/* Left Button */}
  <button
    onClick={scrollLeft}
    className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
    aria-label="Scroll left"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </button>

  {/* Right Button */}
  <button
    onClick={scrollRight}
    className="bg-linear-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
    aria-label="Scroll right"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  </button>
</div>
  </div>
</div>
  );
}

export default SuggestedMatches;
