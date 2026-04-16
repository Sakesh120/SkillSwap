function Card({ image, text, className = "", align = "left", enableHoverEffect = true }) {
  return (
    <div
      className={`relative group overflow-hidden w-150 h-80 rounded-2xl bg-white shadow-md
      transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${className}`}
    >

      {/* Dark overlay */}
      {enableHoverEffect && (
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      )}

      {/* Main Content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center h-full transition-all duration-300
        ${enableHoverEffect ? "group-hover:opacity-0" : ""}`}
      >
        <img src={`/${image}`} alt={text} className="w-45 mb-2" />
        <p className="font-semibold">{text}</p>
      </div>

      {/* Sliding Panel */}
      {enableHoverEffect && (
        <div
          className={`
            absolute inset-0 overflow-hidden
            ${align === "left"
              ? "-translate-x-full group-hover:translate-x-0"
              : "translate-x-full group-hover:translate-x-0"}
            transition-all duration-500
          `}
        >
          {/* Gradient Layer */}
          <div className="absolute inset-0 bg-linear-to-r from-blue-400/80 via-blue-300/70 to-blue-200/60"></div>

          {/* Text */}
          <div className="relative z-10 flex items-center justify-center h-full px-6">
            <p className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500">
              Learn more about <span className="font-bold">{text}</span> in SkillSwap.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;