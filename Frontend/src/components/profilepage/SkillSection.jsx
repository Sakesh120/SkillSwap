import React, { useState } from "react";

function SkillSection({ title, skills, setSkills, type }) {
  const [input, setInput] = useState("");

  const bgClass =
    type === "primary"
      ? "bg-gradient-to-br from-blue-50 to-cyan-100"
      : "bg-gradient-to-br from-orange-50 to-amber-100";
  const badgeClass =
    type === "primary"
      ? "bg-blue-200 text-blue-700 hover:bg-blue-300"
      : "bg-orange-200 text-orange-700 hover:bg-orange-300";
  const emoji = type === "primary" ? "🎓" : "🎯";


  return (
    <div className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-5 shadow-sm`}>
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
