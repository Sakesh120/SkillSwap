import React from "react";

function Button({ text, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`mb-4 flex min-w-[12rem] break-inside rounded-3xl bg-black px-6 py-3 dark:bg-slate-800 dark:text-white sm:min-w-[14rem] sm:px-8 sm:py-4 ${className}`}
    >
      <div className="flex flex-1 items-center justify-between gap-4">
        <span className="text-fluid-label font-medium text-white">
          {text}
        </span>

        <img
          width="25"
          height="25"
          viewBox="0 0 17 17"
          fill="none"
          src="rightarrow.svg"
          alt="arrow"
        />
      </div>
    </button>
  );
}

export default Button;
