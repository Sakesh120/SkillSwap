function Skills() {
  const skills = [
    "Web Development",
    "Graphic Design",
    "Music",
    "Video Editing",
    "Photography",
    "Programming",
    "UI/UX Design",
    "Language Learning"
  ];

  return (
    <div className="mt-1 text-center">
      <h2 className="font-[Space_Grotesk] text-4xl font-bold text-center ">POPULAR SKILLS</h2>

      <div className="overflow-hidden w-full py-6 bg-white">
  <div className="scroll-right flex gap-12 whitespace-nowrap">

    {[...skills, ...skills].map((skill, index) => (
      <span key={index} className=" px-4 py-2 rounded-full text-sm font-medium
bg-white text-gray-800
border border-transparent
bg-linear-to-r from-blue-200 via-purple-200 to-pink-200
bg-clip-border
shadow-[0_0_15px_rgba(99,102,241,0.5)]
hover:scale-105 transition tag inline-block">
        {skill}
      </span>
    ))}

  </div>
</div>

<div className="border-t text-center py-4 text-gray-500 text-sm mt-5"> </div>

    </div>
  );
}

export default Skills;