function MatchCard({ user, onRequest }) {
  return (
    <div className="min-w-50 bg-gray-50 rounded-xl p-4 border hover:shadow-md hover:scale-[1.02] transition">
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
        <span className="font-medium">Teach:</span> {user.teach.join(", ")}
      </p>

      <p className="text-xs text-gray-600 mb-3">
        <span className="font-medium">Learn:</span> {user.learn.join(", ")}
      </p>

      {/* CTA */}
      <button
        onClick={() => onRequest(user._id)}
        className="cursor-pointer w-full text-sm bg-blue-500 text-white py-1.5 rounded-lg hover:bg-blue-600 transition"
      >
        Request Swap
      </button>
    </div>
  );
}

export default MatchCard;
