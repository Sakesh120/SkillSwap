import { useEffect, useRef, useState } from "react"; 


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
    { threshold: 0.2 }
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
    "Learn New Skill"
  ];

  const images = [
    "Signup.png",
    "Teach.png",
    "Earncredits.png",
    "Usecredits.png",
    "Learnskills.png",
  ];

  

  return (
    <div className="py-16 text-center"
     style={{
        backgroundImage: "url('/Howbg.png')", // put image in public folder
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
      <h2 className="text-2xl font-bold mb-10">HOW IT WORKS</h2>

      <div className="flex flex-col justify-center space-y-0">
        {steps.map((step, index) => {
          const image = images[index] || images[0];
          return (

            <div key={index} 
              ref={(el) => (sectionRef.current[index] = el)}
               data-index={index}
              className="flex justify-center items-center mb-10 ml-5 mr-5 ">
              <div className={`w-full flex ${
              index % 2 === 0 ? "justify-start" : "justify-end"
      }`}>


                <div className={`
      relative flex flex-col text-gray-700 bg-white shadow-md rounded-xl w-70 h-90
      transition-all duration-700 ease-out delay-[${index * 100}ms]
      ${
        visibleCards.includes(index.toString())
          ? "opacity-100 translate-x-0"
          : `opacity-0 ${
              index % 2 === 0 ? "-translate-x-80" : "translate-x-80"
            }`
      }
    `}
    style={{ transitionDelay: `${index * 100}ms` }}
    >

                  <div className="relative mx-1  overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-full">
                    <img src={image} alt={step} className="h-full w-full object-contain" />
                  </div>

                  <div className="p-1 self-center">
                    <div className="flex items-center justify-between mb-2">
                      <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        {step}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HowItWorks;