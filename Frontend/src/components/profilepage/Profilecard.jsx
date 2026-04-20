import React from "react";

function Profilecard({ profile, teachSkills, learnSkills }) {
  return (
    <div className="
      bg-white/20 backdrop-blur-lg shadow-lg rounded-xl p-3 
      flex flex-col items-center text-center w-64
      transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-2xl
    ">

      {/* PROFILE IMAGE */}
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 mb-2">
        {profile.image && (
          <img
            src={profile.image}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        )}
      </div>

      <h2 className="text-fluid-h3 font-semibold">{profile.name}</h2>
      <p className="text-fluid-caption text-gray-500">{profile.tagline}</p>

      {/* TEACH */}
      <div className="w-full mt-4 text-left">
        <h3 className="text-fluid-label mb-1 font-semibold">Skills You Can Teach</h3>
        <div className="flex flex-wrap gap-1">
          {teachSkills.map((s, i) => (
            <span 
              key={i} 
              className="bg-blue-100 text-blue-600 px-2 py-0.5 text-xs rounded transition hover:bg-blue-500 hover:text-white cursor-pointer"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* LEARN */}
      <div className="w-full mt-4 mb-4 text-left">
        <h3 className="text-fluid-label mb-1 font-semibold">Skills You Want to Learn</h3>
        <div className="flex flex-wrap gap-1">
          {learnSkills.map((s, i) => (
            <span 
              key={i} 
              className="bg-gray-200 px-2 py-0.5 text-xs rounded transition hover:bg-gray-400 hover:text-white cursor-pointer"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full">

        <div className="
          bg-white/20 backdrop-blur-lg shadow rounded-lg p-3
          transition hover:bg-white/30
        ">
          <h3 className="text-fluid-label mb-1 font-semibold">About</h3>
          <p className="text-fluid-caption text-gray-600">
            {profile.about}
          </p>
        </div>

        <div className="
          bg-white/20 backdrop-blur-lg shadow rounded-lg p-3
          transition hover:bg-white/30
        ">
          <h3 className="text-fluid-label mb-1 font-semibold">Stats</h3>
          <p className="text-fluid-caption text-gray-600">
            {profile.stats}
          </p>
        </div>

      </div>

    </div>
  );
}

export default Profilecard;
