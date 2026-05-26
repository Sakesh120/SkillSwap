import { useEffect, useState } from "react";
import { getUserTutorials } from "../../api/tutorial.api";

function MyUploads() {
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const res = await getUserTutorials();
        const userTutorials = res.data?.tutorials || [];
        setTutorials(userTutorials);
      } catch (error) {
        console.error("Failed to load tutorials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  if (loading || tutorials.length === 0) {
    return null;
  }

  const getVideoSrc = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:3000${url}`;
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg border-white/30 rounded-2xl shadow-sm border p-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-fluid-h3 font-semibold text-gray-800">
              My Uploads
            </h2>
            <p className="text-sm text-gray-500">
              {tutorials.length} tutorial{tutorials.length > 1 ? "s" : ""}{" "}
              uploaded
            </p>
          </div>
        </div>
      </div>

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
        {tutorials.map((tutorial, index) => (
          <div
            key={`${tutorial.url}-${index}`}
            className="relative shrink-0 w-72 overflow-hidden rounded-lg shadow-lg  group"
          >
            <video
              className="h-40 w-full object-cover"
              src={getVideoSrc(tutorial.url)}
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
                className="rounded-full bg-white/90 p-3 transition hover:bg-white cursor-pointer"
                onClick={() => setSelectedTutorial(tutorial)}
              >
                <span className="block h-0 w-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-slate-900" />
              </button>
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/50 to-transparent px-3 py-3">
              <h3 className="text-sm font-semibold text-white line-clamp-2">
                {tutorial.caption || "Untitled tutorial"}
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                {tutorial.skillCategory || "No category"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedTutorial.caption || "Watch Tutorial"}
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedTutorial.skillCategory || "No category"}
                </p>
              </div>
              <button
                onClick={() => setSelectedTutorial(null)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm cursor-pointer text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="bg-black p-4">
              <video
                src={getVideoSrc(selectedTutorial.url)}
                controls
                autoPlay
                className="w-full rounded-3xl xl:h-[30vh] bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyUploads;
