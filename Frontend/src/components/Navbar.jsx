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
      className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 transition-transform duration-300 sm:px-4"
      style={{ transform: show ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="app-shell rounded-3xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-14 w-20 object-contain sm:h-16 sm:w-24 lg:h-18 lg:w-28"
            />
          </Link>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3 text-sm text-black sm:gap-4 sm:text-base xl:text-lg">
            {!user ? (
              <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/">How it works</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </div>
            ) : (
              <div className="flex flex-1 flex-wrap items-center justify-end gap-3 sm:gap-4">
                <div className="group hidden flex-row-reverse items-center overflow-hidden rounded-full border border-white/20 bg-white/10 px-2 py-2 shadow-lg backdrop-blur-2xl transition-all duration-500 ease-in-out lg:flex lg:w-12 lg:hover:w-[320px]">
                  <button className="shrink-0 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 p-2 text-white">
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
                <span className="hidden sm:inline">Alerts</span>

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
                    <span className="text-sm font-medium">You</span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-400 px-3 py-2 text-sm text-white hover:bg-red-500 sm:px-4"
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
