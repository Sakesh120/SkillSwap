import React from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Registration() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });

  const [skills] = useState([
    "Web Development",
    "Graphic Design",
    "Photography",
    "Video Editing",
  ]);

  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [teachInput, setTeachInput] = useState("");
  const [learnInput, setLearnInput] = useState("");

  const handleSelectTeach = (skill) => {
    if (!teachSkills.includes(skill)) {
      setTeachSkills([...teachSkills, skill]);
    }
  };

  const handleSelectLearn = (skill) => {
    if (!learnSkills.includes(skill)) {
      setLearnSkills([...learnSkills, skill]);
    }
  };

  const removeTeachSkill = (skillToRemove) => {
    setTeachSkills(teachSkills.filter((skill) => skill !== skillToRemove));
  };

  const removeLearnSkill = (skillToRemove) => {
    setLearnSkills(learnSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTeach = (e) => {
    if (e.key === "Enter" && teachInput.trim() !== "") {
      e.preventDefault();
      if (!teachSkills.includes(teachInput.trim())) {
        setTeachSkills([...teachSkills, teachInput.trim()]);
      }
      setTeachInput("");
    }
  };

  const handleAddLearn = (e) => {
    if (e.key === "Enter" && learnInput.trim() !== "") {
      e.preventDefault();
      if (!learnSkills.includes(learnInput.trim())) {
        setLearnSkills([...learnSkills, learnInput.trim()]);
      }
      setLearnInput("");
    }
  };

  // 🚀 🔥 FINAL HANDLE SUBMIT (CONNECTED TO API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (teachSkills.length === 0 || learnSkills.length === 0) {
      alert("Please add at least one skill");
      return;
    }

    try {
      // ✅ Match backend format EXACTLY
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        skillsOffered: teachSkills,
        skillsWanted: learnSkills,
      };

      console.log("Sending payload:", payload);

      // 🔗 API call (via AuthContext)
      await register(payload);

      // ✅ Redirect after success
      navigate("/profilepage");
    } catch (err) {
      console.log("Registration error:", err);
      alert("Registration failed");
    }
  };

  return (
    <div className=" relative min-h-screen  flex flex-col items-center justify-center "
    style={{ backgroundImage: "url('/hero.png')", // put image in public folder
        backgroundSize: "cover",
        backgroundPosition: "center", }}>
      <Navbar />

{/* over lay */}
       <div className="absolute  inset-0 bg-white/40 "></div>

{/* 🔥 Content (above overlay) */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center overflow-y-hidden no-scrollbar  p-4">

        <div className="w-full max-w-md max-h-[85vh] overflow-y-auto flex flex-col items-center  bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-xl p-8  no-scrollbar ">
          <img src={logo} alt="Logo" className="w-64 mb-6" />
          <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

          <div className="input details w-full">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="user credentials space-y-4">
                <div className="name">
                  <label className="block mb-1">Name :</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 outline-none"
                  />
                </div>

                <div className="email">
                  <label className="block mb-1">Email :</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 rounded-2xl  bg-linear-to-tr from-sky-100 via-white to-blue-100 outline-none"
                  />
                </div>

                <div className="password">
                  <label className="block mb-1">Password :</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 rounded-2xl  bg-linear-to-tr from-sky-100 via-white to-blue-100 outline-none"
                  />
                </div>

                <div className="confirm Pass">
                  <label className="block mb-1">Confirm Password :</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 outline-none"
                  />
                </div>
              </div>

              {/* SKILLS UI SAME (no changes) */}

              <div className="skills section space-y-4">
                <div className="can teach">
                  <label className="block mb-1">Skills you can teach :</label>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((skill, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectTeach(skill)}
                        className="bg-linear-to-tr from-sky-100 via-white to-blue-100 px-3 py-1 rounded-2xl hover:bg-blue-500"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={teachInput}
                    onChange={(e) => setTeachInput(e.target.value)}
                    onKeyDown={handleAddTeach}
                    className="w-full p-2 rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100"
                  />

                  <div className="flex flex-wrap gap-2 mt-3">
                    {teachSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 rounded-2xl flex items-center gap-2"
                      >
                        {skill}
                        <span onClick={() => removeTeachSkill(skill)}>✕</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="want-to-learn">
                  <label className="block mb-1">Skills you want to learn :</label>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((skill, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectLearn(skill)}
                        className="bg-linear-to-tr from-sky-100 via-white to-blue-100 px-3 py-1 rounded-2xl hover:bg-blue-500"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={learnInput}
                    onChange={(e) => setLearnInput(e.target.value)}
                    onKeyDown={handleAddLearn}
                    className="w-full p-2 rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100"
                  />

                  <div className="flex flex-wrap gap-2 mt-3">
                    {learnSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 rounded-2xl flex items-center gap-2"
                      >
                        {skill}
                        <span onClick={() => removeLearnSkill(skill)}>✕</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button className="w-full bg-linear-to-tr from-sky-100 via-white to-blue-100 p-2 rounded-2xl font-semibold">
                Sign Up
              </button>
            </form>
          </div>

          <Link to="/login" className="mt-4 text-center block text-sm">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registration;
