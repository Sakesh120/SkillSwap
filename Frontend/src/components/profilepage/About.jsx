import React, { useState } from "react";

function About({ profile, setProfile }) {

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      about: e.target.value
    });
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg  border border-white/30 shadow-lg rounded-xl  p-5">

      {!isEditing ? (
        // 🔹 VIEW MODE
        <>

        
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">About</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 text-sm"
            >
              Edit
            </button>
          </div>

          <p className="text-sm text-gray-600">
            {profile.about}
          </p>
        </>
      ) : (
        // 🔹 EDIT MODE
        <div className="flex flex-col gap-3">

          <textarea
            value={profile.about}
            onChange={handleChange}
            className="p-2 border rounded h-24 resize-none"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-3 py-1 rounded"
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