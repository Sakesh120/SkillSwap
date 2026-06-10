import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Landingpage from "./pages/Landingpage";
import Profilepage from "./pages/Profilepage";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import Myuploads from "./pages/Upload";
import ViewProfile from "./pages/Viewprofile";
import MySessions from "./pages/MySessions";
import About from "./pages/About";
import SearchResults from "./pages/SearchResults";
import HowitWorks from "./pages/howitworks";
import Chat from "./pages/Chat";
import Chats from "./pages/Chats";
import WorkFlow from "./components/WorkFlow";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/profilepage" element={<Profilepage />} />
        <Route path="/upload" element={<Myuploads />} />
        <Route path="/search" element={<SearchResults />} />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <ViewProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-sessions"
          element={
            <PrivateRoute>
              <MySessions />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:sessionId"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <PrivateRoute>
              <Chats />
            </PrivateRoute>
          }
        />
        <Route path="/how-it-works" element={<HowitWorks />} />
      </Routes>
    </>
  );
}

export default App;
