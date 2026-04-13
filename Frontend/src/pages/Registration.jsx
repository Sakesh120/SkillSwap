import React from 'react'
import { useState } from "react";
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'

function Registration() {

    const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  teachSkill: "",
  learnSkill: "",
  bio: "",
});

const [skills, setSkills] = useState([
  "Web Development",
  "Graphic Design",
  "Photography",
  "Video Editing"
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
  setTeachSkills(teachSkills.filter(skill => skill !== skillToRemove));
};

const removeLearnSkill = (skillToRemove) => {
  setLearnSkills(learnSkills.filter(skill => skill !== skillToRemove));
};


const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleAddTeach = (e) => {
  if (e.key === "Enter" && teachInput.trim() !== "") {
    e.preventDefault();
    setTeachSkills([...teachSkills, teachInput]);
    setTeachInput("");
  }
};

const handleAddLearn = (e) => {
  if (e.key === "Enter" && learnInput.trim() !== "") {
    e.preventDefault();
    setLearnSkills([...learnSkills, learnInput]);
    setLearnInput("");
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  console.log({
    ...formData,
    teachSkills,
    learnSkills
  });
};

  return (
    <div className="  min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100 bg-gray-900 flex flex-col items-center justify-center ">
       <Navbar />

    
    <div className='scroll'>
    <div className=" flex flex-col items-center justify-center signup-section min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-8 rounded-xl w-full max-w-lg shadow-lg">
      <img src={logo} alt="Logo" className="w-64 mb-6"/> 
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

        <div className="input details">
            <form onSubmit={handleSubmit} className="space-y-5"> 

                <div className="user credentials space-y-4">

                    <div className="name">
                        <label className="block mb-1">Name :</label> 
                        <input 
                          type="text" 
                          placeholder="Enter your name." 
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
                          placeholder="Enter your email." 
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
                          placeholder="Enter password." 
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
                          placeholder="Enter password again." 
                          name="confirmPassword" 
                          value={formData.confirmPassword} 
                          onChange={handleChange}
                          className="w-full p-2 rounded-2xl bg-gray-700 outline-none"
                        />
                    </div>

                </div>

                <div className="skills section space-y-4">

                    <div className="can teach">
                        <label className="block mb-1">Skills you can teach :</label>
                       <div className="can teach">

  {/* Skill List */}
  <div className="flex flex-wrap gap-2 mb-3">
    {skills.map((skill, index) => (
      <button
        key={index}
        type="button"
        onClick={() => handleSelectTeach(skill)}
        className="bg-gray-700 px-3 py-1 rounded-2xl hover:bg-blue-500"
      >
        {skill}
      </button>
    ))}
  </div>

  {/* Input for custom skill */}
  <input
    type="text"
    placeholder="Type and press Enter"
    className="w-full p-2 rounded-2xl bg-gray-700"
    value={teachInput}
    onChange={(e) => setTeachInput(e.target.value)}
    onKeyDown={handleAddTeach}
  />

  {/* teach Skills */}
  <div className="flex flex-wrap gap-2 mt-3">
    {teachSkills.map((skill, index) => (
      <div
        key={index}
        className="bg-blue-500 px-3 py-1 rounded-2xl flex items-center gap-2"
      >
        {skill}
        <span
          className="cursor-pointer"
          onClick={() => removeTeachSkill(skill)}
        >
          ✕
        </span>
      </div>
    ))}
  </div>
</div>
                    </div>

                    <div className="want-to-learn">
                        <label className="block mb-1">Skills you want to learn :</label>
                        <div className="can teach">

  {/* Skill List */}
  <div className="flex flex-wrap gap-2 mb-3">
    {skills.map((skill, index) => (
      <button
        key={index}
        type="button"
        onClick={() => handleSelectLearn(skill)}
        className="bg-gray-700 px-3 py-1rounded-2xl hover:bg-blue-500"
      >
        {skill}
      </button>
    ))}
  </div>

  {/* Input for custom skill */}
  <input
    type="text"
    placeholder="Type and press Enter"
    className="w-full p-2 rounded-2xl bg-gray-700"
    value={learnInput}
    onChange={(e) => setLearnInput(e.target.value)}
    onKeyDown={handleAddLearn}
  />

  {/* learn Skills */}
  <div className="flex flex-wrap gap-2 mt-3">
    {learnSkills.map((skill, index) => (
      <div
        key={index}
        className="bg-blue-500 px-3 py-1 rounded-2xl flex items-center gap-2"
      >
        {skill}
        <span
          className="cursor-pointer"
          onClick={() => removeLearnSkill(skill)}
        >
          ✕
        </span>
      </div>
    ))}
  </div>
</div>

                    </div>

                </div>

                <div className="bio">
                    <label className="block mb-1">Short Bio :</label>
                    <textarea 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleChange}
                      className="w-full p-2 rounded-2xl bg-gray-700"
                    ></textarea> 
                </div>

                <div className="profile-photo">
                    <label className="block mb-1">Upload profile photo :</label>
                    <input type="file" className="w-full text-sm"/>  
                </div>

                <button className="w-full bg-blue-500 hover:bg-blue-600 transition p-2 rounded-2xl font-semibold">
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
  )
}

export default Registration