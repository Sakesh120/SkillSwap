function PromoCards() {
  const cards = [
    {
      id: 1,
      title: "Programming Skills",
      subtitle: "Swap coding skills with others",
      cta: "Swap Skill",
      image: "/PS.png",
    },
    {
      id: 2,
      title: "Theory Subjects",
      subtitle: "Learn and teach concepts",
      cta: "Request Swap",
      image: "/TS.png",
    },
    {
      id: 3,
      title: "IT Technology",
      subtitle: "Connect with tech experts",
      cta: "Connect & Swap",
      image: "/IT.png",
    },
    {
      id: 4,
      title: "SkillSwap App",
      subtitle: "Explore mobile experience",
      cta: "Explore",
      image: "/promo-app.jpg",
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
            className="relative overflow-hidden rounded-xl p-4 flex flex-col justify-between h-40 hover:shadow-md hover:scale-[1.02] transition bg-slate-200"
            style={{
              backgroundImage: `url('${card.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/20" />

            {/* TEXT */}
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-white">
                {card.title}
              </h3>
              <p className="text-xs text-white mt-1">{card.subtitle}</p>
            </div>

            {/* CTA */}
            <button className="relative z-10 mt-3 text-xs bg-white/85 text-gray-900 backdrop-blur px-3 py-1.5 rounded-lg hover:bg-white transition">
              {card.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PromoCards;
