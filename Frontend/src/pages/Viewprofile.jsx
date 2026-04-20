import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/user.api";

function ViewProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError("Invalid profile link.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await getUserById(id);
        setProfile(res.data);
      } catch (err) {
        console.error("Error loading public profile:", err);
        setProfile(null);
        setError("Could not load this profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const averageRating = profile?.averageRating || 0;
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : "N/A";
  const avatarSrc = profile?.avatar?.image
    ? `http://localhost:3000${profile.avatar.image}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile?.name || "Skill Swap",
      )}&background=C7D2FE&color=4338CA&size=256`;

  const statCards = [
    {
      label: "Rating",
      value: averageRating.toFixed(1),
      note: averageRating > 0 ? "Trusted by the community" : "No ratings yet",
    },
    {
      label: "Credits",
      value: profile?.credits || 0,
      note: "Available for future sessions",
    },
    {
      label: "Completed",
      value: profile?.skillSwapsCompleted || 0,
      note: "Skill swaps finished",
    },
    {
      label: "Connections",
      value: profile?.connections || 0,
      note: `Member since ${memberSince}`,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-violet-50 via-blue-50 to-indigo-100 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-300/50 border-t-blue-500" />
          <p className="text-fluid-label uppercase tracking-[0.3em] text-violet-700">
            Loading profile
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-violet-50 via-blue-50 to-indigo-100 px-4">
        <div className="max-w-md rounded-3xl border border-white/70 bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl">
          <p className="text-fluid-h3 font-semibold text-slate-700">
            {error || "Profile not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-screen overflow-x-hidden bg-linear-to-br from-violet-50 via-blue-50 to-indigo-100 text-slate-800 mt-10">
      <div className=" pointer-events-none absolute inset-0 max-w-screen overflow-hidden">
        <div className="absolute left-[-10%] top-12 h-72 w-72 rounded-full bg-violet-300/35 blur-3xl" />
        <div className="absolute right-[-8%] top-32 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl overflow-x-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="overflow-hidden rounded-4xl border border-white/70 bg-linear-to-br from-white/85 via-violet-50/90 to-blue-100/80 shadow-[0_25px_70px_rgba(129,140,248,0.18)] backdrop-blur-xl">
            <div className="border-b border-violet-100/80 px-6 py-4 sm:px-8">
              <p className="text-fluid-caption font-medium uppercase tracking-[0.35em] text-violet-600">
                Public Profile
              </p>
            </div>

            <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[220px_1fr] lg:items-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-48 w-48 overflow-hidden rounded-4xl border border-white/80 bg-white/70 p-2 shadow-xl">
                  <img
                    src={avatarSrc}
                    alt={profile.name}
                    className="h-full w-full rounded-3xl object-cover"
                  />
                </div>

                <div className="text-fluid-caption rounded-full border border-violet-200 bg-violet-100/80 px-4 py-1 uppercase tracking-[0.3em] text-violet-700">
                  Open to swap
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-3">
                  <h1 className="text-fluid-h1 font-black text-slate-800">
                    {profile.name}
                  </h1>
                  <p className="text-fluid-lead max-w-2xl text-slate-600">
                    {profile.tagline || "Building skills through practical exchange."}
                  </p>
                </div>

                <div className="text-fluid-label flex flex-wrap gap-3 text-slate-600">
                  <div className="rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm">
                    Rating: {averageRating.toFixed(1)} / 5
                  </div>
                  <div className="rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm">
                    Member since: {memberSince}
                  </div>
                  <div className="rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm">
                    Connections: {profile.connections || 0}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/80 bg-white/65 p-5 shadow-sm backdrop-blur-sm">
                  <p className="text-fluid-caption mb-3 font-semibold uppercase tracking-[0.3em] text-violet-600">
                    About
                  </p>
                  <p className="text-fluid-p text-slate-600">
                    {profile.about ||
                      "This member has not added a detailed bio yet, but you can still explore their teaching and learning interests below."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-[1.75rem] border border-white/70 bg-white/65 p-5 shadow-xl backdrop-blur-xl"
              >
                <p className="text-fluid-caption uppercase tracking-[0.25em] text-slate-500">
                  {card.label}
                </p>
                <p className="text-fluid-h2 mt-3 font-black text-slate-800">{card.value}</p>
                <p className="text-fluid-p mt-2 text-slate-600">{card.note}</p>
              </div>
            ))}
          </aside>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_0.9fr]">
          <SkillPanel
            title="Can teach"
            subtitle="Skills this member is ready to share"
            skills={profile.skillsOffered}
            tone="blue"
          />

          <SkillPanel
            title="Wants to learn"
            subtitle="Topics they are actively exploring"
            skills={profile.skillsWanted}
            tone="violet"
          />

          <div className="rounded-4xl border border-white/70 bg-linear-to-b from-white/80 to-violet-50/80 p-6 shadow-xl backdrop-blur-xl">
            <p className="text-fluid-caption font-semibold uppercase tracking-[0.3em] text-indigo-600">
              Snapshot
            </p>

            <div className="mt-6 space-y-5">
              <SnapshotRow
                label="Best fit"
                value={
                  averageRating >= 4
                    ? "Experienced collaborator"
                    : averageRating > 0
                      ? "Growing practitioner"
                      : "New community member"
                }
              />
              <SnapshotRow
                label="Availability signal"
                value={
                  profile?.credits
                    ? `${profile.credits} credits ready`
                    : "No credits listed"
                }
              />
              <SnapshotRow
                label="Exchange energy"
                value={
                  (profile?.skillsOffered || []).length > 0 &&
                  (profile?.skillsWanted || []).length > 0
                    ? "Balanced teach and learn profile"
                    : "Still building out their swap details"
                }
              />
              <SnapshotRow
                label="Community footprint"
                value={`${profile?.skillSwapsCompleted || 0} completed swaps`}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SkillPanel({ title, subtitle, skills = [], tone }) {
  const toneClasses =
    tone === "violet"
      ? "border-violet-100 bg-linear-to-br from-white/80 to-violet-100/80"
      : "border-sky-100 bg-linear-to-br from-white/80 to-blue-100/80";

  return (
    <div
      className={`rounded-4xl border p-6 shadow-xl backdrop-blur-xl ${toneClasses}`}
    >
      <p className="text-fluid-caption font-semibold uppercase tracking-[0.3em] text-slate-700">
        {title}
      </p>
      <p className="text-fluid-p mt-3 text-slate-600">{subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="text-fluid-label rounded-full border border-white/80 bg-white/75 px-4 py-2 font-medium text-slate-700 shadow-sm"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-fluid-p text-slate-500">No skills listed yet.</p>
        )}
      </div>
    </div>
  );
}

function SnapshotRow({ label, value }) {
  return (
    <div className="border-b border-violet-100 pb-4 last:border-b-0 last:pb-0">
      <p className="text-fluid-caption uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="text-fluid-p mt-2 text-slate-700">{value}</p>
    </div>
  );
}

export default ViewProfile;
