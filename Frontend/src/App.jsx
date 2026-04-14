import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Landingpage from "./pages/Landingpage";
import Profilepage from "./pages/Profilepage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
         <Route path="/profilepage" element={<Profilepage />} />
      </Routes>
    </>
  );
}

export default App;