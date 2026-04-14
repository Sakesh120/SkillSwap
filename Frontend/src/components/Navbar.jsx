import { Link } from "react-router-dom";
import logo from '../assets/logo.png';
import { useState, useEffect } from "react";

function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);


     const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down
        setShow(false);
      } else {
        // scrolling up
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-1 bg-blue/30 backdrop-blur-sm z-50  transition-transform duration-300" style={{ transform: show ? "translateY(0)" : "translateY(-100%)"   
     }}>
      <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />

      <div className="flex items-center space-x-8 text-xl  text-black">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/">How it works</Link>
        {isLoggedIn ? (
  <div className="flex flex-row items-center gap-4">
    <span>🔔</span>
    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
  </div>
) : (
  <div className="flex gap-4">
    <Link to="/login">Login</Link>
    <Link to="/signup">Sign Up</Link>
  </div>
)}
      </div>
    </div>
  );
}

export default Navbar;