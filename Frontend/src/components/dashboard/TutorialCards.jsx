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
                className="relative shrink-0 w-72 overflow-hidden rounded-lg shadow-lg group"
              >
                {isActive ? (
                  <video
                    className="h-40 w-full object-cover"
                    src={videoSrc}
                    controls
                    autoPlay
                    playsInline
                    onEnded={() => setActiveIndex(null)}
                  />
                ) : (
                  <>
                    <video
                      className="h-40 w-full object-cover"
                      src={videoSrc}
                      onLoadedMetadata={(e) => {
                        // Capture video thumbnail
                        const canvas = document.createElement("canvas");
                        canvas.width = e.target.videoWidth;
                        canvas.height = e.target.videoHeight;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(e.target, 0, 0);
                      }}
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        className="rounded-full bg-white/90 p-3 transition cursor-pointer hover:bg-white"
                        onClick={() => handlePlay(index)}
                      >
                        <span className="block h-0 w-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-slate-900" />
                      </button>
                    </div>
                  </>
                )}

                {/* Text Overlay */}
                {!isActive && (
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/50 to-transparent px-3 py-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-2">
                      {tutorial.caption || "No caption"}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1">
                      {tutorial.skillCategory || "No category"}
                    </p>
                    {tutorial.userName && (
                      <p className="text-xs text-gray-400 mt-1">
                        {tutorial.userName}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TutorialCards;
