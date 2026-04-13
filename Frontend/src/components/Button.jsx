import React from "react";

function Button({ text, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex break-inside bg-black rounded-3xl px-8 py-4 mb-4 min-w-50 dark:bg-slate-800 dark:text-white 
      ${className}`}
    >
      
      <div className="flex items-center justify-between flex-1">
        <span className="text-lg font-medium text-white">{text}</span>

         <img width='25' height='25' viewBox='0 0 17 17' fill='none' src="rightarrow.svg"  alt="arrow" />
    </div>
      
    </button>
  );
}

export default Button;