function RequestItem({ name }) {
  return (
    <div className="flex justify-between items-center py-2 border-b">

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <p>{name}</p>
      </div>

      <div className="space-x-3 text-sm">
        <button className="text-green-600">Accept</button>
        <button className="text-red-500">Reject</button>
      </div>

    </div>
  );
}

export default RequestItem;