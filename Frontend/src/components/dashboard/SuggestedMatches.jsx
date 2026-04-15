import { useEffect, useState } from "react";
import Profilecard from "../profilepage/Profilecard";

function SuggestedMatches() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("profiles")) || [];
    if (stored.length === 0) {
      const defaultUsers = [
        { name: "Sam", tagline: "React Expert", image: null, about: "Loves coding", teachSkills: ["React"], learnSkills: ["Node"] },
        { name: "Eli", tagline: "JS Guru", image: null, about: "Passionate about JS", teachSkills: ["JavaScript"], learnSkills: ["Python"] },
        { name: "Holdar", tagline: "Designer", image: null, about: "Creative mind", teachSkills: ["UI/UX"], learnSkills: ["React"] },
        { name: "Max", tagline: "Backend Dev", image: null, about: "Server side", teachSkills: ["Node"], learnSkills: ["React"] },
         { name: "Max", tagline: "Backend Dev", image: null, about: "Server side", teachSkills: ["Node"], learnSkills: ["React"] },
          { name: "Max", tagline: "Backend Dev", image: null, about: "Server side", teachSkills: ["Node"], learnSkills: ["React"] }
      ];
      setUsers(defaultUsers);
    } else {
      setUsers(stored);
    }
  }, []);

  return (
    <div className="px-2">

      <h2 className="text-lg font-semibold mb-4">Suggested matches</h2>

      {/*  HORIZONTAL SCROLL ONLY */}
      <div className="
        flex gap-4 
        overflow-x-auto overflow-y-hidden
        p-5
        scrollbar-hide
        no-scrollbar

      ">

        {users.map((user, i) => (
          <div key={i} className="shrink-0">
            <Profilecard
              profile={user}
              teachSkills={user.teachSkills || []}
              learnSkills={user.learnSkills || []}
            />
          </div>
        ))}

      </div>

    </div>
  );
}

export default SuggestedMatches;