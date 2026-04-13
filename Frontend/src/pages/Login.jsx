import React from 'react'   
import { useState } from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
       <Navbar />

      <img src={logo} alt="Logo" className="mb-4 w-40 h-40 object-contain" />
      
      <h1 className="text-3xl font-bold mb-6">Log in</h1>
      
      <form 
        action="" 
        onSubmit={handleSubmit} 
        className="bg-gray-800 p-6 rounded-xl w-80"
      >
        <div className="email mb-4">
          <label htmlFor="email" className="block mb-1">Email :</label>
          <input 
            type="email" 
            placeholder="Enter your email."  
            className="w-full p-2 rounded bg-gray-700 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="password mb-4">
          <label htmlFor="pass" className="block mb-1">Password :</label>
          <input 
            type="password"  
            placeholder="Enter password" 
            className="w-full p-2 rounded bg-gray-700 outline-none"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
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