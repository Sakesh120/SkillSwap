function MatchCard({ name }) {
  return (
    <div className="bg-purple-100 rounded-xl p-4 w-56 flex flex-col items-center">

      <div className="w-14 h-14 bg-gray-300 rounded-full mb-2"></div>

      <div className="bg-white px-3 py-1 rounded mb-2 text-sm font-medium">
        {name}
      </div>

      <p className="text-sm text-gray-600">Can teach: [skill]</p>
      <p className="text-sm text-gray-600 mb-3">Want: [UI/UX]</p>

      <button className="bg-blue-400 text-white px-3 py-1 rounded">
        Request Swap
      </button>
    </div>
  );
}

export default MatchCard;