import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ NEW

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
      style={{ transform: show ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="app-shell w-screen border border-white/20 bg-white/10 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">

          {/* LOGO */}
          <Link to="/" className="shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-14 w-20 object-contain sm:h-16 sm:w-24 lg:h-18 lg:w-28"
            />
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* 🔍 SEARCH (DESKTOP ONLY) */}
            {user && (
              <div className="group hidden flex-row-reverse items-center overflow-hidden rounded-full border border-white/20 bg-white/10 px-2 py-2 shadow-lg backdrop-blur-2xl transition-all duration-500 ease-in-out lg:flex lg:w-12 lg:hover:w-[320px]">
                <button className="cursor-pointer shrink-0 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 p-2 text-white">
                  <Search size={18} />
                </button>

                <input
                  type="text"
                  placeholder="Search skills..."
                  className="w-0 bg-transparent px-3 text-gray-700 opacity-0 outline-none transition-all duration-500 placeholder:text-gray-400 group-hover:w-full group-hover:opacity-100"
                />
              </div>
            )}

            {/* 🖥️ DESKTOP MENU */}
            <div className="hidden lg:flex items-center gap-4 text-black">
              {!user ? (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/about">About</Link>
                  <Link to="/#how-it-works">How it works</Link>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Sign Up</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard">Discover</Link>
                  <Link to="/my-sessions">My Sessions</Link>
                  <span>🔔</span>

                  {/* PROFILE */}
                  <div
                    className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-blue-400 bg-gray-300"
                    onClick={() => navigate("/profilepage")}
                  >
                    {user?.avatar?.image ? (
                      <img
                        src={`http://localhost:3000${user.avatar.image}`}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-medium">You</span>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="cursor-pointer rounded-lg bg-red-400 px-3 py-2 text-white hover:bg-red-500"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

{/* MOBILE SEARCH */}
{user && (
  <div className="lg:hidden flex items-center bg-white/70 backdrop-blur-md rounded-full px-2 py-1">
    <Search size={16} className="text-gray-600" />
    <input
      type="text"
      placeholder="Search..."
      className="bg-transparent outline-none text-sm px-2 w-24"
    />
  </div>
)}


            {/* 🍔 HAMBURGER (MOBILE ONLY) */}
            <button
              className="lg:hidden flex flex-col gap-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="w-6 h-0.5 bg-black"></span>
              <span className="w-6 h-0.5 bg-black"></span>
              <span className="w-6 h-0.5 bg-black"></span>
            </button>
          </div>
        </div>

       {/* 📱 MOBILE MENU */}
{menuOpen && (
  <div className="lg:hidden bg-white/90 backdrop-blur-xl px-6 py-4 shadow-md text-black flex flex-col divide-y divide-gray-300">

    {!user ? (
      <>
        <Link to="/" onClick={() => setMenuOpen(false)} className="py-3">
          Home
        </Link>

        <Link to="/about" onClick={() => setMenuOpen(false)} className="py-3">
          About
        </Link>

        <Link to="/#how-it-works" onClick={() => setMenuOpen(false)} className="py-3">
          How it works
        </Link>

        <Link to="/login" onClick={() => setMenuOpen(false)} className="py-3">
          Login
        </Link>

        <Link to="/signup" onClick={() => setMenuOpen(false)} className="py-3">
          Sign Up
        </Link>
      </>
    ) : (
      <>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="py-3">
          Discover
        </Link>

        <Link to="/my-sessions" onClick={() => setMenuOpen(false)} className="py-3">
          My Sessions
        </Link>

        <button
          onClick={() => {
            navigate("/profilepage");
            setMenuOpen(false);
          }}
          className="text-left py-3 w-full"
        >
          Profile
        </button>

        <button
          onClick={() => {
            handleLogout();
            setMenuOpen(false);
          }}
          className="text-left py-3 w-full text-red-500"
        >
          Logout
        </button>
      </>
    )}
  </div>
)}
      </div>
    </div>
  );
}

export default Navbar;