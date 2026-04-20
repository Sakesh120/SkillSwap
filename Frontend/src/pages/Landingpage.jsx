import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Skills from "../components/Skills.jsx";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== "#how-it-works") {
      return;
    }

    const section = document.getElementById("how-it-works");

    if (!section) {
      return;
    }

    const navbarOffset = 100;
    const sectionTop =
      section.getBoundingClientRect().top + window.scrollY - navbarOffset;

    window.scrollTo({
      top: sectionTop,
      behavior: "smooth",
    });
  }, [location]);

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
