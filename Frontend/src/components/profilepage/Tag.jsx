import React from "react";

function Tag({ text, type = "primary" }) {
  return (
    <span
      className={` px-3 py-1 rounded-full text-sm ${
        type === "primary"
          ? "bg-blue-100 text-blue-600"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {text}
    </span>
  );
}

export default Tag;