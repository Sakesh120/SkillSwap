import React, { useState } from "react";

function About({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      about: e.target.value,
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-300 rounded-xl p-5 shadow-sm">
      {!isEditing ? (
        // 🔹 VIEW MODE
        <>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">✍️</span> About
            </h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Edit
            </button>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            {profile.about || "No bio added yet"}
          </p>
        </>
      ) : (
        // 🔹 EDIT MODE
        <div className="flex flex-col gap-3">
          <textarea
            value={profile.about}
            onChange={handleChange}
            className="p-3 border border-purple-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
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
