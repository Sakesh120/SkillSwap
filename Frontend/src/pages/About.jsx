import { useEffect, useRef, useState } from "react";

const detailCards = [
  {
    title: "Peer-to-Peer Skill Exchange",
    description:
      "SkillSwap helps learners teach what they know and learn what they need through a balanced skill-sharing model.",
  },
  {
    title: "Credit-Based Learning Journey",
    description:
      "Users earn credits by teaching sessions and spend credits to join sessions from others, creating a fair ecosystem.",
  },
  {
    title: "Community Driven Growth",
    description:
      "From practical guidance to long-term mentorship, SkillSwap promotes meaningful interactions among learners.",
  },
];

const teamMembers = [
  {
    name: "Sakesh Chopkar",
    role: "Full Stack Developer",
    about:
      "Builds and integrates end-to-end platform features across frontend, backend, and data flow.",
  },
  {
    name: "Rohit Khandalkar",
    role: "Frontend Developer",
    about:
      "Focuses on responsive interfaces, component architecture, and smooth user interactions.",
  },
  {
    name: "Swapnil Lakhade",
    role: "UI Designer",
    about:
      "Designs clean visual systems, user-first layouts, and consistent interface experiences.",
  },
  {
    name: "Swapnil Meshram",
    role: "Supportive Member",
    about:
      "Supports feature testing, review cycles, and team coordination to keep delivery stable.",
  },
  {
    name: "Vaibhav Doye",
    role: "Supportive Member",
    about:
      "Contributes to execution support, quality checks, and overall project momentum.",
  },
];

function About() {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observedElements = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => {
              const next = new Set(prev);
              next.add(entry.target.dataset.revealId);
              return next;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    observedElements.current.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const setObservedRef = (element) => {
    if (element && !observedElements.current.includes(element)) {
      observedElements.current.push(element);
    }
  };

  const isVisible = (id) => visibleItems.has(id);

  return (
    <main className="min-h-screen bg-white pt-28 text-black">
      <section
        className="py-12 md:py-20"
        style={{
          backgroundImage: "url('/Howbg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="page-shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-block rounded-full border border-sky-500/30 bg-white/70 px-4 py-1 text-sm tracking-wide text-sky-700 backdrop-blur-sm">
            About SkillSwap
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Learn Faster by Sharing Skills Together
          </h1>
          <p className="mx-auto max-w-3xl text-base text-slate-700 md:text-lg">
            SkillSwap is a collaborative platform where people teach and learn
            from each other through structured sessions, transparent credit
            exchange, and community support.
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href="#team"
              className="rounded-full bg-linear-to-r from-sky-500 to-emerald-500 px-6 py-3 font-semibold text-white transition hover:scale-105"
            >
              Meet the Team
            </a>
          </div>
        </div>
        </div>
      </section>

      <section
        className="py-10 md:py-16"
        style={{
          backgroundImage: "url('/Featuresbg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="page-shell">
        <div className="grid gap-6 md:grid-cols-3">
          {detailCards.map((card, index) => {
            const revealId = `detail-${index}`;
            return (
              <article
                key={card.title}
                data-reveal-id={revealId}
                ref={setObservedRef}
                className={`rounded-2xl border border-black/10 bg-white/85 p-6 shadow-lg backdrop-blur-sm transition-all duration-700 ${
                  isVisible(revealId)
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <h2 className="mb-3 text-xl font-semibold text-sky-700">
                  {card.title}
                </h2>
                <p className="text-slate-700">{card.description}</p>
              </article>
            );
          })}
        </div>
        </div>
      </section>

      <section id="team" className="bg-white pb-20 pt-8 md:pb-28 md:pt-12">
        <div className="page-shell">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="text-3xl font-bold md:text-5xl">Our Team</h2>
          <p className="mt-3 text-slate-700">
            The people behind SkillSwap who turn ideas into a helpful learning
            experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member, index) => {
            const revealId = `member-${index}`;
            return (
              <article
                key={member.name}
                data-reveal-id={revealId}
                ref={setObservedRef}
                className={`group rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40 transition-all duration-700 hover:-translate-y-1 hover:border-sky-300 ${
                  isVisible(revealId)
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 110}ms` }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700">
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <h3 className="text-xl font-semibold text-black">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-emerald-600">
                  {member.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  {member.about}
                </p>
              </article>
            );
          })}
        </div>
        </div>
      </section>
    </main>
  );
}

export default About;