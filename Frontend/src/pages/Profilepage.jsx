import React, { useState } from "react";
import ProfileHeader from "../components/profilepage/ProfileHeader";
import SkillSection from "../components/profilepage/SkillSection";
import About from "../components/profilepage/About";
import Stats from "../components/profilepage/Stats";

function Profilepage() {
  const [profile, setProfile] = useState({  
    name: "Your Name",
    tagline: "Short tagline",
    image: null,
    about: "Write something about yourself...",
  });

  const [teachSkills, setTeachSkills] = useState(["React", "JS"]);
  const [learnSkills, setLearnSkills] = useState(["Node"]);

  return (
    <div
      className="min-h-screen p-4 sm:p-6 md:p-8 mt-15"
      style={{
        backgroundImage: "url('/dashbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* CENTER CONTAINER */}
      <div className="max-w-5xl mx-auto space-y-6">

        {/* PROFILE */}
        <ProfileHeader profile={profile} setProfile={setProfile} />

        {/* SKILLS */}
        <SkillSection
          title="Skills You Can Teach"
          skills={teachSkills}
          setSkills={setTeachSkills}
          type="primary"
        />

        <SkillSection
          title="Skills You Want to Learn"
          skills={learnSkills}
          setSkills={setLearnSkills}
          type="secondary"
        />

        {/* ABOUT + STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <About profile={profile} setProfile={setProfile} />
          <Stats profile={profile} setProfile={setProfile} />
        </div>

      </div>

    </div>
  );
}

export default Profilepage;