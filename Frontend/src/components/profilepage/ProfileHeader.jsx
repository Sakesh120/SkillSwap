import React from "react";

function ProfileHeader({ profile, onAvatarClick, viewOnly = false }) {
  const hasAvatar = Boolean(profile?.avatar?.image);

  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-6 shadow-sm">
      <span className="text-fluid-label mb-3 flex items-center gap-2 font-semibold text-gray-800">
        Profile
      </span>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={viewOnly ? undefined : onAvatarClick}
          disabled={viewOnly || !hasAvatar}
          className={`h-24 w-24 overflow-hidden rounded-full border-2 bg-indigo-200 shadow-md transition-all duration-300 ${
            viewOnly
              ? "cursor-default border-transparent"
              : "cursor-pointer border-transparent hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          }`}
          aria-label="View profile avatar"
        >
          {hasAvatar ? (
            <img
              src={`http://localhost:3000${profile.avatar.image}`}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-300 to-blue-400 text-3xl text-white">
              U
            </div>
          )}
        </button>

        <div className="flex-1">
          <h2 className="text-fluid-h2 font-bold text-gray-800">
            {profile?.name || "Name"}
          </h2>
          <p className="text-fluid-p font-medium text-indigo-600">
            {profile?.tagline || "Tagline"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
