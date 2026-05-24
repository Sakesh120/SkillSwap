// pages/Dashboard.jsx

import SuggestedMatches from "../components/dashboard/SuggestedMatches";
import RequestsOverview from "../components/dashboard/RequestsOverview";
import PromoCards from "../components/dashboard/PromoCards";
import ActiveSessions from "../components/dashboard/ActiveSessions";
import Activity from "../components/dashboard/Activity";
import TutorialCards from "../components/dashboard/TutorialCards";

function Dashboard() {
  return (
    <div
      className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100"
      style={{
        backgroundImage: "url('/dashboardbg.jpg')", // put image in public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="page-shell space-y-6 pb-8 pt-24 sm:space-y-8 sm:pt-28 xl:pt-32">
        <SuggestedMatches />
        <RequestsOverview />
        <PromoCards />
        <ActiveSessions />
        <TutorialCards />
        <Activity />
      </div>
    </div>
  );
}

export default Dashboard;
