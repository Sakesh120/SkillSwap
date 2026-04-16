import React from "react";

function Stats({ profile }) {
  const averageRating = profile?.averageRating || 0;
  const credits = profile?.credits || 0;

  return (
    <div className="space-y-4">
      {/* RATING CARD */}
      <div className="bg-linear-to-br from-yellow-50 to-yellow-100 border border-yellow-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">⭐</span> Rating
          </h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-yellow-600">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-600">/5.0</span>
        </div>
        <div className="mt-3 text-xs text-gray-600 flex items-center gap-1">
          <span>{"★".repeat(Math.round(averageRating))}</span>
          <span className="ml-1">
            {averageRating > 0
              ? `${Math.round(averageRating * 10) / 10} out of 5`
              : "No ratings yet"}
          </span>
        </div>
      </div>

      {/* CREDITS CARD */}
      <div className="bg-linear-to-br from-green-50 to-emerald-100 border border-green-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">💰</span> Credits
          </h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-green-600">{credits}</span>
          <span className="text-sm text-gray-600">available</span>
        </div>
        <div className="mt-3 text-xs text-gray-600">
          Use credits for skill exchange sessions
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-100 border border-blue-300 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">📊</span> Activity
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">🔄 Skill Swaps Completed</span>
            <span className="font-semibold text-gray-800">
              {profile?.skillSwapsCompleted || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">👥 Connections</span>
            <span className="font-semibold text-gray-800">
              {profile?.connections || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">📅 Member Since</span>
            <span className="font-semibold text-gray-800">
              {profile?.createdAt
                ? new Date(profile.createdAt).getFullYear()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
