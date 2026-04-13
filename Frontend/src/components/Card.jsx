function Card({ image, title, text, className = "", style = {} }) {
  const label = title || text;

  return (
    <div className={`relative flex flex-col text-gray-700 bg-white shadow-md rounded-xl w-70 h-90 ${className}`} style={style}>
      <div className="relative mx-1 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-full">
        <img src={image} alt={label} className="h-full w-full object-contain" />
      </div>
      <div className="p-1 self-center">
        <div className="flex items-center justify-between mb-2">
          <p className="block   font-[Poppins] text-lg font-semibold antialiased leading-relaxed text-blue-gray-900">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Card;