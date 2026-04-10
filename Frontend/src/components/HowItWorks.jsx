function HowItWorks() {
  const steps = [
    "Sign Up",
    "Teach a Skill",
    "Earn Credits",
    "Use Credits",
    "Learn New Skill"
  ];

  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-bold mb-10">HOW IT WORKS</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="border px-6 py-3 rounded-full"
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;