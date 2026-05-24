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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {tutorials.map((tutorial, index) => (
          <div
            key={`${tutorial.url}-${index}`}
            className="flex min-h-65 flex-col justify-between overflow-hidden rounded-xl bg-slate-200 p-4 transition hover:scale-[1.02] hover:shadow-md"
          >
            <div className="flex h-40 items-center justify-center rounded-3xl bg-slate-900 text-white">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
                  ▶
                </div>
                <span className="text-sm text-gray-300">Tutorial Preview</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-fluid-h5 font-semibold text-gray-900">
                {tutorial.caption || "Untitled tutorial"}
              </h3>
              <p className="text-fluid-p mt-2 text-gray-600">
                {tutorial.skillCategory || "No category"}
              </p>
            </div>

            <button
              onClick={() => setSelectedTutorial(tutorial)}
              className="mt-4 w-fit rounded-lg bg-white/85 px-4 py-2 text-xs font-semibold text-gray-900 backdrop-blur transition hover:bg-white sm:text-sm"
            >
              Watch Now
            </button>
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
                className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="bg-black p-4">
              <video
                src={getVideoSrc(selectedTutorial.url)}
                controls
                className="w-full rounded-3xl bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyUploads;
