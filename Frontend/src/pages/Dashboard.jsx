import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import ProfileHeader from "../components/dashboard/ProfileHeader";
import SkillSection from "../components/dashboard/SkillSection";
import About from "../components/dashboard/About";
import Stats from "../components/dashboard/Stats";

function Dashboard() {
  const [profile, setProfile] = useState({  
  name: "Your Name",
  tagline: "Short tagline",
  image: null,
  about: "Write something about yourself...",}); // Initialize with default profile object

  const [teachSkills, setTeachSkills] = useState(["React", "JS"]);
  const [learnSkills, setLearnSkills] = useState(["Node"]);


  return (
    <div>
      <div className="min-h-screen   p-4 md:p-6 mt-15"
         style={{
        backgroundImage: "url('/dashbg.jpg')", // put image in public folder
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
      >
      

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Sidebar profile={profile}
           teachSkills={teachSkills}
           learnSkills={learnSkills}
            about={profile.info}
           />
          <div className="lg:col-span-2 space-y-6">
            <ProfileHeader profile={profile} setProfile={setProfile} />
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
            <div className="grid md:grid-cols-2 gap-6">
                <About profile={profile} setProfile={setProfile} />
                <Stats profile={profile} setProfile={setProfile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;