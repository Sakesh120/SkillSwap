import React from "react";

function Sidebar({ profile, teachSkills, learnSkills , }) {
  return (
    <div className=" bg-white/20 backdrop-blur-lg  border border-white/30 shadow-lg rounded-xl  p-5 flex flex-col items-center text-center">

      {/* PROFILE IMAGE */}
      <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-300 mb-3">
        {profile.image && (
          <img
            src={profile.image}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <h2 className="text-xl font-semibold">{profile.name}</h2>
      <p className="text-gray-500 text-sm">{profile.tagline}</p>


      {/* TEACH */}
      <div className="w-full mt-6 text-left">
        <h3 className="font-semibold mb-2">Skills You Can Teach</h3>
        <div className="flex flex-wrap gap-2">
          {teachSkills.map((s, i) => (
            <span key={i} className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* LEARN */}
      <div className="w-full mt-6 mb-6 text-left">
        <h3 className="font-semibold mb-2">Skills You Want to Learn</h3>
        <div className="flex flex-wrap gap-2">
          {learnSkills.map((s, i) => (
            <span key={i} className="bg-gray-200 px-2 py-1 rounded">
              {s}
            </span>
          ))}
        </div>
      </div>

       <div className="grid md:grid-cols-2 gap-6">

       <div className="bg-white/20 backdrop-blur-lg  border border-white/30 shadow-lg rounded-xl  p-5">
      <h3 className="font-semibold mb-2">About</h3>
      <p className="text-sm text-gray-600">
        {profile.about}
      </p>
    </div>

    <div className="bg-white/20 backdrop-blur-lg  border border-white/30 shadow-lg rounded-xl  p-5">
      <h3 className="font-semibold mb-2">Stats</h3>
      <p className="text-sm text-gray-600">
        {profile.stats}
      </p>
    </div>

</div>

    </div>
  );
}

export default Sidebar;