import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../api/user.api";
import ProfileHeader from "../components/profilepage/ProfileHeader";
import SkillSection from "../components/profilepage/SkillSection";
import About from "../components/profilepage/About";
import Stats from "../components/profilepage/Stats";

function Profilepage() {
  const { user, setUser, loading } = useAuth();
  const [profile, setProfile] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    tagline: "",
    about: "",
    skillsOffered: [],
    skillsWanted: [],
    avatar: null,
  });

  // Fetch profile data when component mounts or when loading finishes
  useEffect(() => {
    if (!loading) {
      const fetchProfile = async () => {
        try {
          const res = await getProfile();
          setUser(res.data);
          setProfile(res.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, [loading, setUser]);

  // Update editForm when user/profile changes
  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      setEditForm({
        name: profile.name || "",
        tagline: profile.tagline || "",
        about: profile.about || "",
        skillsOffered: profile.skillsOffered || [],
        skillsWanted: profile.skillsWanted || [],
        avatar: null,
      });
    }
  }, [profile]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(editForm, editForm.avatar);
      const updatedUser = res.data.user;
      setUser(updatedUser);
      setProfile(updatedUser);
      // Update localStorage with latest data
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const addSkill = (type, skill) => {
    if (skill && !editForm[type].includes(skill)) {
      setEditForm({
        ...editForm,
        [type]: [...editForm[type], skill],
      });
    }
  };

  const removeSkill = (type, skill) => {
    setEditForm({
      ...editForm,
      [type]: editForm[type].filter((s) => s !== skill),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      ) : (
        <>
          {/* MAIN CONTAINER */}
          <div className="max-w-6xl mx-auto space-y-6 mt-5">
            {/* PROFILE HEADER */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <ProfileHeader profile={profile} setProfile={setProfile} />
              <button
                onClick={() => setShowEditModal(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <SkillSection
                title="Skills You Can Teach"
                skills={profile.skillsOffered || []}
                setSkills={(skills) =>
                  setProfile({ ...profile, skillsOffered: skills })
                }
                type="primary"
              />

              <SkillSection
                title="Skills You Want to Learn"
                skills={profile.skillsWanted || []}
                setSkills={(skills) =>
                  setProfile({ ...profile, skillsWanted: skills })
                }
                type="secondary"
              />
            </div>

            {/* ABOUT + STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ABOUT */}
              <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
                <About profile={profile} setProfile={setProfile} />
              </div>

              {/* STATS */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <Stats profile={profile} />
              </div>
            </div>
          </div>

          {/* EDIT MODAL */}
          {showEditModal  && (
            <div className="fixed inset-0 bg-linear-to-r from-purple-100 via-pink-100 to-blue-100 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Tagline</label>
                    <input
                      type="text"
                      value={editForm.tagline}
                      onChange={(e) =>
                        setEditForm({ ...editForm, tagline: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">About</label>
                    <textarea
                      value={editForm.about}
                      onChange={(e) =>
                        setEditForm({ ...editForm, about: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Avatar</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditForm({ ...editForm, avatar: e.target.files[0] })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Skills You Can Teach
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add skill"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill("skillsOffered", e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="flex-1 border rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editForm.skillsOffered.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 px-2 py-1 rounded flex items-center gap-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill("skillsOffered", skill)}
                            className="text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Skills You Want to Learn
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add skill"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill("skillsWanted", e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="flex-1 border rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editForm.skillsWanted.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill("skillsWanted", skill)}
                            className="text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="border px-4 py-2 rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Profilepage;
