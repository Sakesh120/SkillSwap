import { useEffect, useState } from "react";
import { getAllTutorials } from "../../api/tutorial.api";

function TutorialCards() {
  const [allTutorials, setAllTutorials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchAllTutorials = async () => {
      try {
        const res = await getAllTutorials();
        const tutorials = res.data || [];
        setAllTutorials(tutorials);
      } catch (error) {
        console.error("Failed to load the tutorials", error);
      }
    };

    fetchAllTutorials();
  }, []);

  const getVideoSrc = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:3000${url}`;
  };

  const handlePlay = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg border-white/30 rounded-2xl shadow-sm border p-6">
      {/* HEADER */}
      <h2 className="text-fluid-h3 mb-4 font-semibold text-gray-800">
        Tutorial Suggestions
      </h2>

      {allTutorials.length === 0 ? (
        <p className="text-sm text-gray-600">No tutorials available yet.</p>
      ) : (
        <div
          className="flex gap-4 overflow-x-auto pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onScroll={(e) => {
            if (e.target.style) {
              e.target.style.scrollbarWidth = "none";
              e.target.style.msOverflowStyle = "none";
            }
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {allTutorials.map((tutorial, index) => {
            const isActive = index === activeIndex;
            const videoSrc = getVideoSrc(tutorial.url);

            return (
              <div
                key={index}
                className="relative shrink-0 w-72 overflow-hidden rounded-3xl bg-slate-900/70 p-4 shadow-lg ring-1 ring-white/10"
              >
                <div className="relative h-52 overflow-hidden rounded-3xl bg-black">
                  {isActive ? (
                    <video
                      className="h-full w-full object-cover"
                      src={videoSrc}
                      controls
                      autoPlay
                      playsInline
                      onEnded={() => setActiveIndex(null)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/60 text-white">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
                        onClick={() => handlePlay(index)}
                      >
                        <span>Play</span>
                        <span aria-hidden="true">▶</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="text-fluid-h3 font-semibold text-white">
                    {tutorial.caption || "No caption"}
                  </h3>
                  <p className="text-fluid-p text-gray-300">
                    {tutorial.skillCategory || "No category"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {tutorial.userName ? `By ${tutorial.userName}` : "Tutorial"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TutorialCards;
