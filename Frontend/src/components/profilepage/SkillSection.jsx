import React, { useState } from "react";

function SkillSection({ title, skills, setSkills, type }) {

  const [input, setInput] = useState("");

  const addSkill = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();
      if (!skills.includes(input)) {
        setSkills([...skills, input]);
      }
      setInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg  border border-white/30 shadow-lg rounded-xl p-5">
      <h3 className="font-semibold mb-3">{title}</h3>

      {/* INPUT */}
      <input
        type="text"
        placeholder="Type and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addSkill}
        className="w-full p-2 mb-3 border rounded"
      />

      {/* SKILLS */}
      <div className=" flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <div
            key={i}
            className={` px-3 py-1 rounded-full flex items-center gap-2 cursor-pointer ${
              type === "primary"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {skill}
            <span onClick={() => removeSkill(skill)}>✕</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillSection;