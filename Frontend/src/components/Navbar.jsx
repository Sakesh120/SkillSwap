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
      className="fixed top-0 left-0 right-0 z-50  transition-transform duration-300 "
      style={{ transform: show ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="app-shell w-screen border border-white/20 bg-white/10 shadow-lg backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-14 w-20 object-contain sm:h-16 sm:w-24 lg:h-18 lg:w-28"
            />
          </Link>

          <div className="text-fluid-p flex flex-1 flex-wrap items-center justify-end gap-3 text-black sm:gap-4">
            {!user ? (
              <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/#how-it-works">How it works</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </div>
            ) : (
              <div className="flex flex-1 flex-wrap items-center justify-end gap-3 sm:gap-4">
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

                <Link to="/dashboard">Discover</Link>
                <Link to="/my-sessions">My Sessions</Link>
                <span className="hidden sm:inline">🔔</span>

                <div
                  className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-blue-400 bg-gray-300"
                  onClick={() => navigate("/profilepage")}
                  title="Go to profile"
                >
                  {user?.avatar?.image ? (
                    <img
                      src={`http://localhost:3000${user.avatar.image}`}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-fluid-p font-medium">You</span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="text-fluid-p cursor-pointer rounded-lg bg-red-400 px-3 py-2 text-white hover:bg-red-500 sm:px-4"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
