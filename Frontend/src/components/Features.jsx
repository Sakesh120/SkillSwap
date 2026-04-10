function Features() {
  const features = [
    "Credit-Based Learning",
    "Peer-to-Peer Teaching",
    "Skill Matching",
    "Secure Login",
    "User Profiles",
    "Rating & Review"
  ];

  return (
    <div className="py-16 text-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-10">FEATURES</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {features.map((item, index) => (
          <div key={index} className="border p-4 w-40">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;