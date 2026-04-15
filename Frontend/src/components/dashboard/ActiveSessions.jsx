import SessionItem from "./SessionItem";

function ActiveSessions() {
  return (
    <div className="bg-white/60 backdrop-blur-lg p-4 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>

      <SessionItem name="Emma - React/Design" />
      <SessionItem name="Mike" />

    </div>
  );
}

export default ActiveSessions;