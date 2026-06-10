import React from "react";
import { useNavigate } from "react-router-dom";
import { TbRoute } from "react-icons/tb";

const WorkFlow = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
      {/* Rotating Sky Blue Glow */}
      <div className="absolute -inset-1 rounded-full bg-conic from-sky-400 via-cyan-200 to-sky-400 animate-spin-slow blur-sm opacity-80"></div>

      {/* Main Button */}
      <button
        onClick={() => navigate("/how-it-works")}
        aria-label="How It Works"
        className="
          relative
          flex
          items-center
          justify-center
          
          w-12 h-12
          sm:w-14 sm:h-14
          md:w-16 md:h-16
          
          rounded-full
          bg-white
          border
          border-gray-100
          shadow-xl

          hover:scale-110
          active:scale-95

          transition-all
          duration-300
        "
      >
        <TbRoute
          className="
            text-sky-600
            text-xl
            sm:text-2xl
            md:text-3xl
          "
        />
      </button>
    </div>
  );
};

export default WorkFlow;
