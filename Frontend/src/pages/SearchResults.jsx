import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchTutorials, searchUsers } from "../api/search.api";
import WorkFlow from "../components/WorkFlow";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [tutorials, setTutorials] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      if (query.trim()) {
        const tutorialsRes = await searchTutorials(query);
        const usersRes = await searchUsers(query);
        setTutorials(tutorialsRes.data || []);
        setUsers(usersRes.data || []);
      } else {
        setTutorials([]);
        setUsers([]);
      }
      setLoading(false);
    };

    performSearch();
  }, [query]);

  const getVideoSrc = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:3000${url}`;
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100 pt-32">
        <div className="page-shell text-center">
          <p className="text-gray-600">Searching for "{query}"...</p>
        </div>
      </div>
    );
  }

  const hasResults = tutorials.length > 0 || users.length > 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100">
      <div className="page-shell space-y-8 pb-8 pt-32 sm:pt-40">
        {/* SEARCH HEADER */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
          <p className="mt-2 text-gray-600">
            {tutorials.length + users.length} results found
          </p>
        </div>

        {!hasResults ? (
          <div className="rounded-2xl bg-white/50 backdrop-blur p-8 text-center">
            <p className="text-lg text-gray-600">
              No results found for "{query}"
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try searching for a skill category, tutorial name, or user
            </p>
          </div>
        ) : (
          <>
            {/* USERS SECTION */}
            {users.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  Users
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {users.map((user) => (
                    <div
                      key={user.userId}
                      onClick={() => handleViewProfile(user.userId)}
                      className="cursor-pointer overflow-hidden rounded-2xl bg-white/40 backdrop-blur-lg transition hover:bg-white/60 border border-white/30 p-4 shadow-md"
                    >
                      <div className="flex flex-col items-center gap-3">
                        {user.userAvatar ? (
                          <img
                            src={`http://localhost:3000${user.userAvatar}`}
                            alt={user.userName}
                            className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-400"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-indigo-500 text-2xl font-bold text-white">
                            {user.userName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <h3 className="text-center font-semibold text-gray-900">
                          {user.userName}
                        </h3>
                        <button className="mt-2 w-full rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TUTORIALS SECTION */}
            {tutorials.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  Tutorials
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {tutorials.map((tutorial, index) => (
                    <div
                      key={`${tutorial.url}-${index}`}
                      className="overflow-hidden rounded-lg shadow-lg"
                    >
                      <div className="relative group">
                        <video
                          className="h-40 w-full object-cover"
                          src={getVideoSrc(tutorial.url)}
                          onLoadedMetadata={(e) => {
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
                            {tutorial.caption || "Untitled"}
                          </h3>
                          <p className="text-xs text-gray-300 mt-1">
                            {tutorial.skillCategory || "No category"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {tutorial.userName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* TUTORIAL MODAL */}
      {selectedTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedTutorial.caption || "Watch Tutorial"}
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedTutorial.skillCategory || "No category"} •{" "}
                  {selectedTutorial.userName}
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
                className="w-full rounded-lg xl:h-[43vh] bg-black"
              />
            </div>
          </div>
        </div>
      )}
      <WorkFlow />
    </div>
  );
}

export default SearchResults;
