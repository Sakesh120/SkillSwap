function Card({
  image,
  text,
  className = "",
  align = "left",
  enableHoverEffect = true,
  style,
}) {
  return (
    <div
      className={`group relative h-72 w-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:h-80 ${className}`}
      style={style}
    >
      {enableHoverEffect && (
        <div className="absolute inset-0 bg-black/30 opacity-0 transition-all duration-500 group-hover:opacity-100"></div>
      )}

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center transition-all duration-300 ${
          enableHoverEffect ? "group-hover:opacity-0" : ""
        }`}
      >
        <div className="mb-3 flex h-28 w-full items-center justify-center px-4 sm:h-32 xl:h-36">
          <img
            src={`/${image}`}
            alt={text}
            className="max-h-full w-auto max-w-full object-contain"
          />
        </div>
        <p className="text-fluid-h3 px-4 text-center font-semibold">{text}</p>
      </div>

      {enableHoverEffect && (
        <div
          className={`absolute inset-0 overflow-hidden transition-all duration-500 ${
            align === "left"
              ? "-translate-x-full group-hover:translate-x-0"
              : "translate-x-full group-hover:translate-x-0"
          }`}
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-400/80 via-blue-300/70 to-blue-200/60"></div>

          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <p className="text-fluid-h3 text-center font-semibold text-white opacity-0 transition-all duration-500 group-hover:opacity-100">
              Learn more about <span className="font-bold">{text}</span> in
              SkillSwap.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
