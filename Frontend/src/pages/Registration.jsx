import React from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (teachSkills.length === 0 || learnSkills.length === 0) {
      alert("Please add at least one skill");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        skillsOffered: teachSkills,
        skillsWanted: learnSkills,
      };

      console.log("Sending payload:", payload);
      await register(payload);
      navigate("/profilepage");
    } catch (err) {
      console.log("Registration error:", err);
      alert("Registration failed");
    }
  };

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: "url('/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/40"></div>

      <div className="form-shell no-scrollbar relative z-10 flex min-h-screen items-center justify-center mt-25 overflow-hidden">
        <div className="no-scrollbar flex max-h-screen w-full max-w-3xl flex-col items-center overflow-y-auto rounded-4xl border border-white/30 bg-white/25 p-6 shadow-lg backdrop-blur-lg sm:p-8 lg:p-10">
          <img src={logo} alt="Logo" className="mb-6 w-40 sm:w-52" />
          <h1 className="mb-6 text-center text-3xl font-bold sm:text-4xl">
            Sign Up
          </h1>

          <div className="input details w-full">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="user credentials grid gap-4">
                <div className="name">
                  <label className="mb-1 block">Name :</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 p-3 outline-none"
                  />
                </div>

                <div className="email">
                  <label className="mb-1 block">Email :</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 p-3 outline-none"
                  />
                </div>

                <div className="password">
                  <label className="mb-1 block">Password :</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 p-3 outline-none"
                  />
                </div>

                <div className="confirm Pass">
                  <label className="mb-1 block">Confirm Password :</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 p-3 outline-none"
                  />
                </div>
              </div>

              <div className="skills section grid gap-4">
                <div className="can teach">
                  <label className="mb-1 block">Skills you can teach :</label>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectTeach(skill)}
                        className="rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 px-3 py-1 hover:bg-blue-500"
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
                    className="w-full rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 p-3"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {teachSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-2xl px-3 py-1"
                      >
                        {skill}
                        <span onClick={() => removeTeachSkill(skill)}>x</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="want-to-learn">
                  <label className="mb-1 block">Skills you want to learn :</label>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectLearn(skill)}
                        className="rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 px-3 py-1 hover:bg-blue-500"
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
                    className="w-full rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 p-3"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {learnSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-2xl px-3 py-1"
                      >
                        {skill}
                        <span onClick={() => removeLearnSkill(skill)}>x</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button className="w-full rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 p-3 font-semibold">
                Sign Up
              </button>
            </form>
          </div>

          <Link to="/login" className="mt-4 block text-center text-sm">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registration;
