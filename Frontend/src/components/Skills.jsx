function Skills() {
  const skills = [
    "Web Development",
    "Graphic Design",
    "Music",
    "Video Editing",
    "Photography",
    "Programming",
    "UI/UX Design",
    "Language Learning",
  ];

  return (
    <div className="mt-1 text-center">
      <div className="app-shell">
        <h2 className="text-center font-[Space_Grotesk] text-3xl font-bold sm:text-4xl xl:text-5xl">
          POPULAR SKILLS
        </h2>
      </div>

      <div className="w-full overflow-hidden bg-white py-6">
        <div className="scroll-right flex gap-8 whitespace-nowrap sm:gap-12">
          {[...skills, ...skills].map((skill, index) => (
            <span
              key={index}
              className="inline-block rounded-full border border-transparent bg-white bg-linear-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-border px-4 py-2 text-sm font-medium text-gray-800 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition hover:scale-105"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t py-4 text-center text-sm text-gray-500"></div>
    </div>
  );
}

export default Skills;
