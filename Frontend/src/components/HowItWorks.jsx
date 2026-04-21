import { useEffect, useRef, useState } from "react";
import Card from "./Card";

function HowItWorks() {
  const sectionRef = useRef([]);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              if (!prev.includes(entry.target.dataset.index)) {
                return [...prev, entry.target.dataset.index];
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.2 },
    );

    sectionRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const steps = [
    "Sign Up",
    "Teach a Skill",
    "Earn Credits",
    "Use Credits",
    "Learn New Skill",
  ];

  const images = [
    "Signup.png",
    "Teach.png",
    "Earncredits.png",
    "Usecredits.png",
    "Learnskills.png",
  ];

  return (
    <div
      id="how-it-works"
      className="overflow-x-hidden py-14 text-center sm:py-18"
      style={{
        backgroundImage: "url('/Howbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full px-4 sm:px-6">
        <h2 className="text-fluid-h2 mb-10 font-[Space_Grotesk] font-bold">
          HOW IT WORKS
        </h2>

        <div className="flex flex-col justify-center">
          {steps.map((step, index) => {
            const image = images[index] || images[0];
            return (
              <div
                key={index}
                ref={(el) => (sectionRef.current[index] = el)}
                data-index={index}
                className="mb-8 flex items-center justify-center sm:mb-10"
              >
              <div className="flex w-full">
              <div
                className={`w-full flex ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                  <Card
                    image={image}
                    text={step}
                    align={index % 2 === 0 ? "left" : "right"}
                    enableHoverEffect={true}
                    className={`h-64 w-full  sm:w-[80%] lg:w-[60%] transition-all duration-700 ease-out sm:h-72 xl:h-80  ${
                      visibleCards.includes(index.toString())
                        ? "translate-x-0 opacity-100"
                        : index % 2 === 0
                            ? "-translate-x-[120%] opacity-0"
                            : "translate-x-[120%] opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  />
                </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
