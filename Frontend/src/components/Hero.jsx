import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import Button from "./Button";
import React, { useEffect, useState } from "react";

function Hero() {

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    
    <div
    
      className="h-screen flex flex-col justify-center items-center text-center text-white pt-20"
      style={{
        backgroundImage: "url('/hero.png')", // put image in public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
      
      }}
    >
        <Navbar />
      {/* overlay */}
      <div className="absolute inset-0 bg-white/50"></div>

        {/* 🔥 Content (above overlay) */}
      <div className="relative z-10  flex flex-col justify-center items-center text-center px-4">
    
      <h1 className={`text-transparent bg-clip-text bg-linear-to-r to-emerald-500 from-sky-400 text-9xl font-bold mb-4 transition-all duration-1000 ease-out   ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 "}`}>
          SKILL SWAP
        </h1>


        <p className={`text-2xl italic font-medium leading-relaxed text-heading text-black mb-8 transition-all duration-2000 ease-out   ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"} `}>
          Learn Skills. Teach Skills. Earn Credits.
        </p>


 <Link to="/signup" className={`transition-all duration-3000 ease-out   ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
        <Button  text="Get Started" 
        >
       
    </Button>
      </Link>
</div>

    </div>
  );
}

export default Hero;