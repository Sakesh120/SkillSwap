import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, getUserById, updateProfile } from "../api/user.api";
import ProfileHeader from "../components/profilepage/ProfileHeader";
import SkillSection from "../components/profilepage/SkillSection";
import About from "../components/profilepage/About";
import Stats from "../components/profilepage/Stats";
import { useNavigate } from "react-router-dom";

function Profilepage({ viewOnly = false, userId = null }) {
  const { id } = useParams();
  const { setUser, loading } = useAuth();
  const [profile, setProfile] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const navigate = useNavigate();
  const [editForm, setEditForm] = useState({
    name: "",
    tagline: "",
    about: "",
    skillsOffered: [],
    skillsWanted: [],
    avatar: null,
  });

  useEffect(() => {
    if (loading) return;

    const fetchProfile = async () => {
      try {
        const targetUserId = userId || id;
        const res =
          viewOnly && targetUserId
            ? await getUserById(targetUserId)
            : await getProfile();

        if (!viewOnly) {
          setUser(res.data);
        }

        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id, loading, setUser, userId, viewOnly]);

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
    <div
      className="no-scrollbar min-h-screen pt-24"
      style={{
        backgroundImage: "url('/profilebg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="text-gray-600">
              {viewOnly ? "Loading profile..." : "Loading your profile..."}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`page-shell mt-5 space-y-6 pb-10 ${showAvatarPreview ? "blur-sm" : ""}`}
          >
            <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-lg backdrop-blur-lg">
              <ProfileHeader
                profile={profile}
                viewOnly={viewOnly}
                onAvatarClick={() => setShowAvatarPreview(true)}
              />

              {!viewOnly && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={() => navigate("/upload")}
                    className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  >
                    Upload Video
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6 rounded-2xl border border-white/30 bg-white/20 p-6 shadow-sm backdrop-blur-lg">
              <SkillSection
                title={
                  viewOnly ? "Skills They Can Teach" : "Skills You Can Teach"
                }
                skills={profile.skillsOffered || []}
                setSkills={
                  viewOnly
                    ? undefined
                    : (skills) =>
                        setProfile({ ...profile, skillsOffered: skills })
                }
                type="primary"
              />

              <SkillSection
                title={
                  viewOnly
                    ? "Skills They Want to Learn"
                    : "Skills You Want to Learn"
                }
                skills={profile.skillsWanted || []}
                setSkills={
                  viewOnly
                    ? undefined
                    : (skills) =>
                        setProfile({ ...profile, skillsWanted: skills })
                }
                type="secondary"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.8fr]">
              <div className="rounded-xl border border-white/30 bg-white/20 p-6 shadow-sm backdrop-blur-lg">
                <About
                  profile={profile}
                  setProfile={viewOnly ? undefined : setProfile}
                  viewOnly={viewOnly}
                />
              </div>

              <div className="rounded-xl border border-white/30 bg-white/20 p-6 shadow-sm backdrop-blur-lg">
                <Stats profile={profile} />
              </div>
            </div>
          </div>

          {!viewOnly && showEditModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
              style={{
                backgroundImage: "url('/editpage.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="no-scrollbar max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white/20 p-6 shadow-lg backdrop-blur-lg sm:p-8">
                <h2 className="mb-4 text-xl font-semibold">Edit Profile</h2>

                <form onSubmit={handleEditSubmit} className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full rounded px-3 py-2"
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
                      className="w-full rounded px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">About</label>
                    <textarea
                      value={editForm.about}
                      onChange={(e) =>
                        setEditForm({ ...editForm, about: e.target.value })
                      }
                      className="h-24 w-full rounded px-3 py-2"
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">
                      Skills You Can Teach
                    </label>
                    <div className="mb-2 flex gap-2">
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
                        className="flex-1 rounded px-3 py-2"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editForm.skillsOffered.map((skill, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill("skillsOffered", skill)}
                            className="text-red-500"
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">
                      Skills You Want to Learn
                    </label>
                    <div className="mb-2 flex gap-2">
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
                        className="flex-1 rounded px-3 py-2"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editForm.skillsWanted.map((skill, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill("skillsWanted", skill)}
                            className="text-red-500"
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 md:col-span-2">
                    <button
                      type="submit"
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAvatarPreview && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setShowAvatarPreview(false)}
            >
              <div
                className="relative max-h-[90vh] max-w-[90vw] p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="scale-100 overflow-hidden rounded-3xl border border-white/20 bg-slate-900/80 opacity-100 shadow-2xl transition-all duration-300 ease-out">
                  <img
                    src={
                      profile?.avatar?.image
                        ? `http://localhost:3000${profile.avatar.image}`
                        : ""
                    }
                    alt="Profile Preview"
                    className="block max-h-[80vh] max-w-[90vw] w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Profilepage;
