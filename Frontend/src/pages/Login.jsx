import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function Login() {
  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div className=" min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100 bg-gray-900 flex flex-col items-center justify-center">
      <Navbar />

      <img src={logo} alt="Logo" className="mt-18 w-40 h-40 object-contain" />

      <h1 className="text-3xl font-bold mb-6">Log in</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center signup-section min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-8 rounded-xl w-full max-w-lg shadow-lg"
      >
        <div className="email mb-4">
          <label htmlFor="email" className="block mb-1">
            Email :
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email."
            onChange={handleChange}
            className="w-full p-2 rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 outline-none"
          />
        </div>

        <div className="password mb-4">
          <label htmlFor="pass" className="block mb-1">
            Password :
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            className="w-full p-2 rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-1000 outline-none"
          />
        </div>

        <a href="" className="forgot-pass-text text-sm text-blue-400">
          Forgot Password?
        </a>

        <button
          className="log-in-button w-full bg-blue-500 p-2 rounded mt-4 hover:bg-blue-600 transition"
          type="submit"
        >
          Log in
        </button>
      </form>

      <div className="sign-up-section-on-login mt-4 text-center">
        <a href="" className="block mb-2">
          Don't have an account?
        </a>

        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
