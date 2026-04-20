import React, { useEffect, useState } from "react";
import { getSessions } from "../../api/session.api";

function Stats({ profile }) {
  const averageRating = profile?.averageRating || 0;
  const credits = profile?.credits || 0;
  const [completedSwaps, setCompletedSwaps] = useState(
    profile?.skillSwapsCompleted || 0,
  );

  useEffect(() => {
    setCompletedSwaps(profile?.skillSwapsCompleted || 0);
  }, [profile?.skillSwapsCompleted]);

  useEffect(() => {
    let isMounted = true;

    const loadCompletedSwaps = async () => {
      try {
        const res = await getSessions();
        const sessions = Array.isArray(res?.data) ? res.data : [];
        const completedCount = sessions.filter(
          (session) => session?.status === "completed",
        ).length;

        if (isMounted) {
          setCompletedSwaps(completedCount);
        }
      } catch (error) {
        console.error("Error loading completed swaps:", error);
      }
    };

    loadCompletedSwaps();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/30 bg-white/20 p-5 shadow-sm backdrop-blur-lg">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-fluid-h3 flex items-center gap-2 font-semibold text-gray-800">
            <span className="text-2xl">*</span> Rating
          </h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-fluid-h2 font-bold text-yellow-600">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-fluid-label text-gray-600">/5.0</span>
        </div>
        <div className="text-fluid-caption mt-3 flex items-center gap-1 text-gray-600">
          <span>{"*".repeat(Math.round(averageRating)) || "New"}</span>
          <span className="ml-1">
            {averageRating > 0
              ? `${Math.round(averageRating * 10) / 10} out of 5`
              : "No ratings yet"}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-linear-to-br from-green-50 to-emerald-100 p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-fluid-h3 flex items-center gap-2 font-semibold text-gray-800">
            <span className="text-2xl">$</span> Credits
          </h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-fluid-h2 font-bold text-green-600">
            {credits}
          </span>
          <span className="text-fluid-label text-gray-600">available</span>
        </div>
        <div className="text-fluid-caption mt-3 text-gray-600">
          Use credits for skill exchange sessions
        </div>
      </div>

      <div className="rounded-xl bg-linear-to-br from-blue-50 to-indigo-100 p-5 shadow-sm">
        <h3 className="text-fluid-h3 mb-3 flex items-center gap-2 font-semibold text-gray-800">
          <span className="text-2xl">#</span> Activity
        </h3>
        <div className="text-fluid-p space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Completed skill swaps</span>
            <span className="font-semibold text-gray-800">{completedSwaps}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Connections</span>
            <span className="font-semibold text-gray-800">
              {profile?.connections || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Member since</span>
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
