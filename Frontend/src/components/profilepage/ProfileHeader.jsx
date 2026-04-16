import React from "react";

function ProfileHeader({ profile }) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-100 border border-indigo-300 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* PROFILE IMAGE */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-200 border-4 border-indigo-300 shadow-md">
          {profile?.avatar?.image ? (
            <img
              src={`http://localhost:3000${profile.avatar.image}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-300 to-blue-400 flex items-center justify-center text-white text-3xl">
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
