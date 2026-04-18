import React from "react";

function ProfileHeader({ profile }) {
  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30  rounded-xl p-6 shadow-sm">
      <span className="font-semibold font text-gray-800 mb-3 flex items-center gap-2 "> 🤵Profile</span>
      <div className="flex items-center gap-4">
        {/* PROFILE IMAGE */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-200 shadow-md">
          {profile?.avatar?.image ? (
            <img
              src={`http://localhost:3000${profile.avatar.image}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-indigo-300 to-blue-400 flex items-center justify-center text-white text-3xl">
              👤
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">
            {profile?.name || "Name"}
          </h2>
          <p className="text-indigo-600 font-medium">
            {profile?.tagline || "Tagline"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
