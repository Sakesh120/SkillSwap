import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Landingpage() {
  return (
     <div className="h-screen flex flex-col items-center justify-top bg-gray-900 text-white">
          
          <img src={logo} alt="Logo" className="mb-4 w-70 h-70 object-contain" />

          <Link to="/signup">
            <button className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10" >Get Started</button>
          </Link>

          </div>

  )
}

export default Landingpage