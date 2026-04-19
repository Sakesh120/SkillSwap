import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

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
      navigate("/Dashboard");
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: "url('/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/40"></div>

      <div className="form-shell relative z-10 flex min-h-screen w-full items-center justify-center py-24">
        <div className="no-scrollbar flex w-full max-w-xl flex-col items-center justify-center rounded-4xl border border-white/35 bg-white/20 p-6 shadow-lg backdrop-blur-lg sm:p-8 lg:max-w-2xl lg:p-10">
          <img
            src={logo}
            alt="Logo"
            className="h-28 w-28 object-contain sm:h-36 sm:w-36"
          />

          <h1 className="mb-6 text-3xl font-bold sm:text-4xl">Log in</h1>

          <form
            onSubmit={handleSubmit}
            className="signup-section flex w-full max-w-xl flex-col items-center justify-center rounded-2xl border border-white/30 bg-white/30 p-6 shadow-lg backdrop-blur-lg sm:p-8"
          >
            <div className="email mb-4 w-full">
              <label htmlFor="email" className="mb-1 block">
                Email :
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email."
                onChange={handleChange}
                className="w-full rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 p-3 outline-none"
              />
            </div>

            <div className="password mb-4 w-full">
              <label htmlFor="pass" className="mb-1 block">
                Password :
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
                className="w-full rounded-2xl bg-linear-to-tr from-sky-100 via-white to-blue-100 p-3 outline-none"
              />
            </div>

            <a href="" className="forgot-pass-text text-sm text-blue-400">
              Forgot Password?
            </a>

            <button
              className="log-in-button mt-4 w-full rounded bg-blue-500 p-3 text-white transition hover:bg-blue-600"
              type="submit"
            >
              Log in
            </button>
          </form>

          <div className="sign-up-section-on-login mt-4 text-center">
            <a href="" className="mb-2 block">
              Don't have an account?
            </a>

            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
