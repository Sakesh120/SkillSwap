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
      image: "/SA.png",
    },
  ];

  return (
    <div className="bg-white/20 backdrop-blur-lg border-white/30 rounded-2xl shadow-sm border p-6">
      {/* HEADER */}
      <h2 className="text-fluid-h3 mb-4 font-semibold text-gray-800">
        Explore Opportunities
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative flex h-44 flex-col justify-between overflow-hidden rounded-xl bg-slate-200 p-4 transition hover:scale-[1.02] hover:shadow-md xl:h-48"
            style={{
              backgroundImage: `url('${card.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/20" />

            {/* TEXT */}
            <div className="relative z-10">
              <h3 className="text-fluid-h3 font-semibold text-white">
                {card.title}
              </h3>
              <p className="text-fluid-p mt-1 max-w-xs text-white">{card.subtitle}</p>
            </div>

            {/* CTA */}
            <button className="cursor-pointer relative z-10 mt-3 w-fit rounded-lg bg-white/85 px-3 py-1.5 text-xs text-gray-900 backdrop-blur transition hover:bg-white sm:text-sm">
              {card.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PromoCards;
