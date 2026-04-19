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
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 text-center text-white sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/50"></div>

      <div className="app-shell relative z-10 flex flex-col items-center justify-center">
        <h1
          className={`mb-4 bg-linear-to-r from-sky-400 to-emerald-500 bg-clip-text text-center text-5xl font-bold text-transparent transition-all duration-1000 ease-out sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[7rem] ${
            show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          SKILL SWAP
        </h1>

        <p
          className={`mb-8 max-w-4xl text-lg font-medium italic leading-relaxed text-black transition-all duration-2000 ease-out sm:text-2xl xl:text-3xl ${
            show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          Learn Skills. Teach Skills. Earn Credits.
        </p>

        <Link
          to="/signup"
          className={`transition-all duration-3000 ease-out ${
            show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <Button text="Get Started" />
        </Link>
      </div>
    </div>
  );
}

export default Hero;
