function PromoCards() {
  const cards = [
    {
      id: 1,
      title: "Programming Skills",
      subtitle: "Swap coding skills with others",
      cta: "Swap Skill",
      bg: "bg-gradient-to-br from-blue-100 to-blue-200",
    },
    {
      id: 2,
      title: "Theory Subjects",
      subtitle: "Learn and teach concepts",
      cta: "Request Swap",
      bg: "bg-gradient-to-br from-green-100 to-green-200",
    },
    {
      id: 3,
      title: "IT Technology",
      subtitle: "Connect with tech experts",
      cta: "Connect & Swap",
      bg: "bg-gradient-to-br from-indigo-100 to-indigo-200",
    },
    {
      id: 4,
      title: "SkillSwap App",
      subtitle: "Explore mobile experience",
      cta: "Explore",
      bg: "bg-gradient-to-br from-purple-100 to-purple-200",
    },
  ];

  return (
    <div className="bg-white/20 backdrop-blur-lg border-white/30 rounded-2xl shadow-sm border p-6">
      {/* HEADER */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Explore Opportunities
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${card.bg} rounded-xl p-4 flex flex-col justify-between h-40 hover:shadow-md hover:scale-[1.02] transition`}
          >
            {/* TEXT */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                {card.title}
              </h3>
              <p className="text-xs text-gray-600 mt-1">{card.subtitle}</p>
            </div>

            {/* CTA */}
            <button className="mt-3 text-xs bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg hover:bg-white transition">
              {card.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PromoCards;
