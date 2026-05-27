import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";
import { getReceivedRequests } from "../api/request.api";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const res = await getReceivedRequests();
        const data = res.data || [];
        setNotifications(data);
        setNotifCount(data.filter((item) => item.status === "pending").length);
        setNotificationsError(null);
      } catch (error) {
        console.error("Error fetching notifications", error);
        setNotificationsError("Unable to load notifications.");
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSearch = (e, query) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setMobileSearchQuery("");
    }
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
              <form
                onSubmit={(e) => handleSearch(e, searchQuery)}
                className="group hidden flex-row-reverse items-center overflow-hidden rounded-full border border-white/20 bg-white/10 px-2 py-2 shadow-lg backdrop-blur-2xl transition-all duration-500 ease-in-out lg:flex lg:w-12 lg:hover:w-[320px]"
              >
                <button
                  type="submit"
                  className="cursor-pointer shrink-0 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 p-2 text-white hover:from-blue-600 hover:to-indigo-600 transition"
                >
                  <Search size={18} />
                </button>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills..."
                  className="w-0 bg-transparent px-3 text-gray-700 opacity-0 outline-none transition-all duration-500 placeholder:text-gray-400 group-hover:w-full group-hover:opacity-100"
                />
              </form>
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

                  <div ref={notificationsRef} className="relative">
                    <button
                      onClick={() => setNotificationsOpen((prev) => !prev)}
                      className="relative text-2xl transition hover:text-blue-600"
                      aria-label="Notifications"
                    >
                      <span>🔔</span>
                      {notifCount > 0 && (
                        <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                          {notifCount}
                        </span>
                      )}
                    </button>

                    {notificationsOpen && (
                      <div className="absolute right-0 top-full z-50 mt-3 w-85 overflow-hidden rounded-3xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-xl text-black">
                        <div className="border-b border-gray-200 px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold">Notifications</p>
                            <span className="text-sm text-gray-500">
                              {notifCount} new
                            </span>
                          </div>
                        </div>

                        <div className="max-h-90 overflow-y-auto">
                          {loadingNotifications && (
                            <div className="p-4 text-sm text-gray-600">
                              Loading notifications...
                            </div>
                          )}

                          {notificationsError && (
                            <div className="p-4 text-sm text-red-500">
                              {notificationsError}
                            </div>
                          )}

                          {!loadingNotifications &&
                            notifications.length === 0 && (
                              <div className="p-4 text-sm text-gray-600">
                                No session requests yet.
                              </div>
                            )}

                          {notifications.map((notif) => (
                            <div
                              key={notif._id}
                              className="border-b border-gray-200 px-4 py-4 last:border-b-0"
                            >
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">
                                  {notif.sender?.name || "Someone"}
                                </span>{" "}
                                requested a session
                              </p>
                              <p className="mt-2 text-sm text-gray-600">
                                Offers{" "}
                                <span className="font-medium text-gray-800">
                                  {notif.skillOffered || "a skill"}
                                </span>
                                , wants{" "}
                                <span className="font-medium text-gray-800">
                                  {notif.skillWanted || "a skill"}
                                </span>
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {new Date(notif.createdAt).toLocaleString()}
                              </p>
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${notif.status === "pending" ? "bg-amber-100 text-amber-800" : notif.status === "accepted" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
                              >
                                {notif.status}
                              </span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setNotificationsOpen(false);
                            navigate("/dashboard");
                          }}
                          className="w-full border-t border-gray-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-blue-600 hover:bg-slate-100"
                        >
                          View all requests
                        </button>
                      </div>
                    )}
                  </div>

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
                    className="cursor-pointer rounded-lg bg-red-400 px-3 py-2 text-white hover:bg-red-500 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* MOBILE SEARCH */}
            {user && (
              <form
                onSubmit={(e) => handleSearch(e, mobileSearchQuery)}
                className="lg:hidden flex items-center bg-white/70 backdrop-blur-md rounded-full px-2 py-1"
              >
                <Search size={16} className="text-gray-600" />
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm px-2 w-24 text-gray-900 placeholder:text-gray-600"
                />
              </form>
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
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="py-3"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className="py-3"
                >
                  About
                </Link>

                <Link
                  to="/#how-it-works"
                  onClick={() => setMenuOpen(false)}
                  className="py-3"
                >
                  How it works
                </Link>

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="py-3"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="py-3"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="py-3"
                >
                  Discover
                </Link>

                <Link
                  to="/my-sessions"
                  onClick={() => setMenuOpen(false)}
                  className="py-3"
                >
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
