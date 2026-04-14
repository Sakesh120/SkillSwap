import React, { useState } from "react";

function ProfileHeader({ profile, setProfile }) {

  const [isEditing, setIsEditing] = useState(false);

  // 🔥 HANDLE IMAGE UPLOAD
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);

      setProfile({
        ...profile,
        image: imageURL
      });
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg  border border-white/30 shadow-lg rounded-xl  p-5">

      {!isEditing ? (
        <div className="flex items-center gap-4">
           {/* PROFILE IMAGE */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300">
            {profile.image ? (
              <img src={profile.image} className="w-full h-full object-cover" />
            ) : null}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-gray-500 text-sm">{profile.tagline}</p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="ml-auto bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">

           {/* IMAGE INPUT */}
          <input type="file" onChange={handleImageChange} />

          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <input
            type="text"
            name="tagline"
            value={profile.tagline}
            onChange={handleChange}
            className="p-2 border rounded"
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

export default ProfileHeader;