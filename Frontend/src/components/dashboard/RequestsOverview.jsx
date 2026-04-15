import RequestItem from "./RequestItem";

function RequestsOverview() {
  return (
    <div className="bg-white/60 backdrop-blur-lg p-4 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">Requests Overview</h2>

      <RequestItem name="John - Wants React" />
      <RequestItem name="Alex - wants node" />

      <p className="text-center text-blue-500 mt-3 cursor-pointer">
        View All
      </p>

    </div>
  );
}

export default RequestsOverview;