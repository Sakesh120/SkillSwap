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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/profilepage" element={<Profilepage />} />
        <Route path="/upload" element={<Myuploads />} />
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
      </Routes>
    </>
  );
}

export default App;
