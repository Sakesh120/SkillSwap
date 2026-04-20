import React, { useState } from "react";

function About({ profile, setProfile, viewOnly = false }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    if (!setProfile) return;

    setProfile({
      ...profile,
      about: e.target.value,
    });
  };

  return (
    <div className="h-full rounded-xl border border-white/30 bg-white/20 p-5 shadow-sm backdrop-blur-lg">
      {!isEditing || viewOnly ? (
        <>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-fluid-h3 flex items-center gap-2 font-semibold text-gray-800">
              <span className="text-2xl">About</span>
            </h3>
          </div>

          <p className="text-fluid-p text-gray-700">
            {profile?.about || "No bio added yet"}
          </p>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <textarea
            value={profile.about}
            onChange={handleChange}
            className="h-24 resize-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default About;
