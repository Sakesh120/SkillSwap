import React, { useState } from "react";

function SkillSection({ title, skills, setSkills, type }) {
  const [input, setInput] = useState("");

  const bgClass =
    type === "primary"
      ? "bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-300"
      : "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-300";
  const badgeClass =
    type === "primary"
      ? "bg-blue-200 text-blue-700 hover:bg-blue-300"
      : "bg-orange-200 text-orange-700 hover:bg-orange-300";
  const emoji = type === "primary" ? "🎓" : "🎯";

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
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className={`${bgClass} border rounded-xl p-5 shadow-sm`}>
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-2xl">{emoji}</span> {title}
      </h3>


      {/* SKILLS */}
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, i) => (
            <div
              key={i}
              className={`${badgeClass} px-3 py-1 rounded-full flex items-center gap-2 cursor-pointer transition`}
            >
              {skill}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No skills added yet</p>
        )}
      </div>
    </div>
  );
}

export default SkillSection;
