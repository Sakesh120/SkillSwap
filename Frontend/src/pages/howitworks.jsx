import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    accent: "from-violet-200 via-white to-fuchsia-100",
    badge: "01",
    icon: Sparkles,
    kicker: "Welcome",
    title: "Get 50 credits on joining",
    short: "Start learning immediately.",
    details:
      "Every new user receives 50 free credits on joining SkillSwap. Use them to begin exploring skills, connecting with talented people, and experiencing the platform without any barriers.",
  },
  {
    accent: "from-fuchsia-100 via-white to-violet-100",
    badge: "02",
    icon: Users,
    kicker: "Teach",
    title: "Share your skills",
    short: "Help others grow.",
    details:
      "Teach what you already know and help other users improve their abilities. Whether it is coding, design, art, editing, or communication, every skill has value inside the SkillSwap community.",
  },
  {
    accent: "from-white via-violet-50 to-purple-100",
    badge: "03",
    icon: Trophy,
    kicker: "Earn",
    title: "Earn credits effortlessly",
    short: "Gain rewards for teaching.",
    details:
      "Every teaching session or contribution increases your credits. The more value you provide to others, the more opportunities you unlock for your own learning journey.",
  },
  {
    accent: "from-violet-100 via-white to-slate-50",
    badge: "04",
    icon: Rocket,
    kicker: "Learn",
    title: "Spend credits smartly",
    short: "Unlock skills from others.",
    details:
      "Use your earned credits to learn from talented people across different fields. Exchange knowledge in a system where teaching and learning naturally support each other.",
  },
  {
    accent: "from-purple-100 via-white to-violet-50",
    badge: "05",
    icon: ShieldCheck,
    kicker: "Grow",
    title: "Grow beyond limits",
    short: "Expand your knowledge network.",
    details:
      "SkillSwap is designed to help you continuously evolve. Explore new skills, connect with ambitious people, and build a strong network that grows along with your journey.",
  },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const cubicPoint = (start, control1, control2, end, t) => {
  const invT = 1 - t;
  const invT2 = invT * invT;
  const t2 = t * t;

  return {
    x:
      invT2 * invT * start.x +
      3 * invT2 * t * control1.x +
      3 * invT * t2 * control2.x +
      t2 * t * end.x,
    y:
      invT2 * invT * start.y +
      3 * invT2 * t * control1.y +
      3 * invT * t2 * control2.y +
      t2 * t * end.y,
  };
};

const cubicTangent = (start, control1, control2, end, t) => {
  const invT = 1 - t;

  return {
    x:
      3 * invT * invT * (control1.x - start.x) +
      6 * invT * t * (control2.x - control1.x) +
      3 * t * t * (end.x - control2.x),
    y:
      3 * invT * invT * (control1.y - start.y) +
      6 * invT * t * (control2.y - control1.y) +
      3 * t * t * (end.y - control2.y),
  };
};

const approximateLength = (start, control1, control2, end, segments = 28) => {
  let total = 0;
  let previous = start;

  for (let index = 1; index <= segments; index += 1) {
    const point = cubicPoint(start, control1, control2, end, index / segments);
    total += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }

  return total;
};

function HowitWorks() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const frameRef = useRef(0);
  const [connectors, setConnectors] = useState([]);

  useEffect(() => {
    const updateConnectors = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const triggerLine = window.innerHeight * 0.68;

      const nextConnectors = [];

      for (let index = 0; index < steps.length - 1; index += 1) {
        const fromNode = cardRefs.current[index];
        const toNode = cardRefs.current[index + 1];

        if (!fromNode || !toNode) continue;

        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();

        const fromIsLeft = index % 2 === 0;
        const toIsLeft = !fromIsLeft;
        const curveOffset = Math.min(240, Math.max(160, containerRect.width * 0.16));

        const start = {
          x: fromIsLeft
            ? fromRect.right - containerRect.left - 2
            : fromRect.left - containerRect.left + 2,
          y: fromRect.top - containerRect.top + fromRect.height * 0.72,
        };

        const end = {
          x: toIsLeft
            ? toRect.right - containerRect.left - 2
            : toRect.left - containerRect.left + 2,
          y: toRect.top - containerRect.top + toRect.height * 0.28,
        };

        const bendDirection = index % 2 === 0 ? 1 : -1;
        const control1 = {
          x: start.x + curveOffset * bendDirection,
          y: start.y + 90,
        };
        const control2 = {
          x: end.x - curveOffset * bendDirection,
          y: end.y - 90,
        };
        const path = `M ${start.x} ${start.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${end.x} ${end.y}`;
        const length = approximateLength(start, control1, control2, end);

        const progress = clamp(
          (triggerLine - fromRect.top - fromRect.height * 0.72) /
            Math.max(toRect.top + toRect.height * 0.28 - (fromRect.top + fromRect.height * 0.72), 1),
          0,
          1,
        );

        nextConnectors.push({
          control1,
          control2,
          end,
          length,
          path,
          progress,
          start,
        });
      }

      setConnectors(nextConnectors);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(updateConnectors);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleUpdate);

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      cancelAnimationFrame(frameRef.current);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#fcfbff] text-slate-800">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-40 top-30 h-105 w-105 rounded-full bg-violet-200/60 blur-3xl" />
        <div className="absolute right-30 top-[12%] h-90 w-90 rounded-full bg-fuchsia-100/70 blur-3xl" />
        <div className="absolute bottom-35 left-[22%] h-95 w-95 rounded-full bg-white blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-10 pt-20 text-center md:pt-28">
        

        <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
          How{" "}
          <span className="bg-linear-to-r from-violet-500 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
            SkillSwap
          </span>{" "}
          works
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
          Follow the flow from profile creation to future opportunities with a
          soft, airy visual system built around portrait cards and curved motion.
        </p>
      </section>

      <section
        ref={containerRef}
        className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-8 md:pb-32"
      >
        <div className="relative">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-linear-to-b from-violet-200 via-violet-300 to-fuchsia-200 md:block" />

          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible md:block"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="connectorStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c4b5fd" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f0abfc" />
              </linearGradient>
              <filter id="connectorGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {connectors.map((connector, index) => {
              const point = cubicPoint(
                connector.start,
                connector.control1,
                connector.control2,
                connector.end,
                connector.progress,
              );
              const tangent = cubicTangent(
                connector.start,
                connector.control1,
                connector.control2,
                connector.end,
                connector.progress,
              );
              const angle = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
              const visibleLength = connector.length * connector.progress;

              return (
                <g key={connector.path}>
                  <path
                    d={connector.path}
                    fill="none"
                    stroke="rgba(196, 181, 253, 0.22)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path
                    d={connector.path}
                    fill="none"
                    stroke="url(#connectorStroke)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${connector.length} ${connector.length}`}
                    strokeDashoffset={connector.length - visibleLength}
                    filter="url(#connectorGlow)"
                    opacity="0.95"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill="#ffffff"
                    stroke="#c084fc"
                    strokeWidth="2"
                    opacity="0.95"
                  />
                  <g transform={`translate(${point.x} ${point.y}) rotate(${angle})`}>
                    <path
                      d="M -12 -7 L 10 0 L -12 7 L -6 0 Z"
                      fill="url(#connectorStroke)"
                      opacity="0.95"
                    />
                  </g>
                  <circle
                    cx={connector.end.x}
                    cy={connector.end.y}
                    r="4"
                    fill={index % 2 === 0 ? "#e9d5ff" : "#f5d0fe"}
                    opacity="0.85"
                  />
                </g>
              );
            })}
          </svg>

          <div className="grid gap-12 md:gap-20">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const alignRight = index % 2 === 1;

              return (
                <div
                  key={step.badge}
                  className={`flex ${alignRight ? "md:justify-end" : "md:justify-start"}`}
                >
                  <article
                    className="group relative w-full max-w-84 [perspective-1600px] sm:max-w-92"
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                  >
                    <div
                      className="relative h-112 w-full transform-3d transition-transform duration-700 hover:-translate-y-2 group-hover:transform-[rotateY(180deg)]"
                      style={{
                        transformStyle: "preserve-3d",
                        WebkitTransformStyle: "preserve-3d",
                      }}
                    >
                      <div
                        className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/85 shadow-[0_28px_70px_rgba(168,85,247,0.14)] ring-1 ring-violet-100/80 backdrop-blur-xl"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        <div
                          className={`absolute inset-0 bg-linear-to-br ${step.accent} opacity-90`}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(255,255,255,0.35)_45%,transparent_80%)]" />
                        <div className="absolute left-4 top-4 rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.25em] text-violet-600">
                          {step.badge}
                        </div>

                        <div className="absolute inset-0 p-6">
                          <div className="flex h-full w-full flex-col justify-between rounded-4xl border border-white/60 bg-white/55 p-6 text-left shadow-inner shadow-white/50">
                            <div className="flex items-center justify-between">
                              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                                {step.kicker}
                              </span>
                              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-sm">
                                <Icon size={22} />
                              </span>
                            </div>

                            <div className="space-y-5">
                              <div className="flex items-center gap-3 text-violet-700">
                                <span className="h-px w-10 bg-violet-200" />
                                <span className="text-xs font-semibold uppercase tracking-[0.3em]">
                                  Portrait card
                                </span>
                              </div>

                              <div className="space-y-3">
                                <h2 className="text-3xl font-black leading-tight text-slate-900">
                                  {step.title}
                                </h2>
                                <p className="text-base leading-relaxed text-slate-600">
                                  {step.short}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-violet-700">
                              <span>Hover to flip</span>
                              <ArrowRight size={16} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-violet-200/80 bg-linear-to-br from-white via-violet-50 to-fuchsia-50 shadow-[0_28px_70px_rgba(168,85,247,0.14)] ring-1 ring-violet-100/80 backdrop-blur-xl"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          WebkitTransform: "rotateY(180deg)",
                        }}
                      >
                        <div className="absolute left-4 top-4 rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.25em] text-violet-600">
                          {step.badge}
                        </div>

                        <div className="absolute inset-0 p-6">
                          <div className="flex h-full w-full flex-col justify-between rounded-4xl border border-white/80 bg-white/70 p-6 text-left shadow-inner shadow-violet-100/70">
                            <div className="flex items-center justify-between">
                              <span className="rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                                Detailed view
                              </span>
                              <span className="rounded-full bg-violet-600/10 px-3 py-1 text-xs font-semibold text-violet-700">
                                Step {index + 1}
                              </span>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-2xl font-black leading-tight text-slate-900">
                                {step.title}
                              </h3>
                              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-700">
                                Detailed information
                              </p>
                              <p className="text-sm leading-7 text-slate-600">
                                {step.details}
                              </p>
                            </div>

                           
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>

     
    </div>
  );
}

export default HowitWorks;
