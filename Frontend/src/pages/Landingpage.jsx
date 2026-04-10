import React from 'react'
import { Link } from 'react-router-dom';

import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Skills from "../components/Skills.jsx";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Landing() {
  return (
    <div className="bg-white text-black">
      <Hero />
      <HowItWorks />
      <Features />
      <Skills />
      <CTA />
      <Footer />
    </div>
  );
}

export default Landing;