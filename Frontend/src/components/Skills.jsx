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
    <div className="py-16 text-center">
      <h2 className="text-xl font-bold mb-6">POPULAR SKILLS</h2>

      <div className="flex flex-wrap justify-center gap-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="border px-4 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Skills;