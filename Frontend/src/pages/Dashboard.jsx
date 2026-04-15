// pages/Dashboard.jsx

import SuggestedMatches from "../components/dashboard/SuggestedMatches";
import RequestsOverview from "../components/dashboard/RequestsOverview";
import PromoCards from "../components/dashboard/PromoCards";
import ActiveSessions from "../components/dashboard/ActiveSessions";
import Activity from "../components/dashboard/Activity";

function Dashboard() {
  
  return (
    <div className="min-h-screen min-w-screen bg-linear-to-br from-blue-50 via-white to-indigo-100">

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 ">

        <SuggestedMatches />
        <RequestsOverview />
        <PromoCards />
        <ActiveSessions />
        <Activity />

      </div>
    </div>
  );
}

export default Dashboard;