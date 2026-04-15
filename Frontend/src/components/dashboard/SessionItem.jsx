function SessionItem({ name }) {
  return (
    <div className="flex justify-between items-center py-3 border-b">

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded-full"></div>
        <p>{name}</p>
      </div>

      <div className="space-x-2">
        <button className="bg-gray-200 px-3 py-1 rounded">
          Open chat
        </button>
        <button className="bg-blue-400 text-white px-3 py-1 rounded">
          Join Session
        </button>
      </div>

    </div>
  );
}

export default SessionItem;