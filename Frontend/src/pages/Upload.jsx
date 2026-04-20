import React, { useState } from "react";
import API from "../api/axios";

function UploadSection() {
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    if (!["video/mp4", "video/quicktime"].includes(selectedFile.type)) {
      alert("Only MP4 or MOV allowed");
      return;
    }

    if (selectedFile.size > 500 * 1024 * 1024) {
      alert("File too large (max 500MB)");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    const finalCategory = category === "custom" ? customCategory : category;

    if (!file || !caption || !finalCategory) {
      alert("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("caption", caption);
    formData.append("category", finalCategory);

    try {
      setLoading(true);
      await API.post("/users/upload-tutorial", formData);
      alert("Upload successful");
      setCaption("");
      setCategory("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 px-4 pb-10 pt-28 sm:px-6">
      <div className="form-shell">
        <div className="mx-auto w-full max-w-4xl rounded-[2rem] bg-gray-100 p-6 shadow-md sm:p-8 lg:p-10">
          <h1 className="text-fluid-h2 mb-6 text-center font-serif">
            Upload Your Video
          </h1>

          <div className="grid gap-6 rounded-xl bg-gray-200 p-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div>
                <label className="text-fluid-h4 mb-2 block">Video Caption</label>
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded-md bg-gray-300 p-3 outline-none"
                  placeholder="Add a caption..."
                />
              </div>

              <div>
                <label className="text-fluid-h4 mb-2 block">Select Skill Category</label>

                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (e.target.value !== "custom") {
                      setCustomCategory("");
                    }
                  }}
                  className="w-full rounded-md bg-gray-300 p-3 outline-none"
                >
                  <option value="">Choose a skill...</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Design">Design</option>
                  <option value="Photography">Photography</option>
                  <option value="custom">Other...</option>
                </select>

                {category === "custom" && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter your skill"
                    className="mt-2 w-full rounded-md bg-gray-300 p-3 outline-none"
                  />
                )}
              </div>

              <div className="flex justify-center lg:justify-start">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="text-fluid-label rounded-full bg-gray-300 px-8 py-2 shadow transition hover:bg-gray-400"
                >
                  {loading ? "Uploading..." : "Submit"}
                </button>
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-gray-400 bg-gray-300 p-8 text-center"
            >
              {!preview ? (
                <>
                  <div className="text-fluid-h3 mb-2">Upload</div>
                  <p className="text-fluid-label mb-3">Drag & drop or</p>

                  <label className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-100">
                    Upload Video
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime"
                      hidden
                      onChange={(e) => handleFileChange(e.target.files[0])}
                    />
                  </label>

                  <p className="text-fluid-caption mt-2">MP4 or MOV, max 500MB</p>
                </>
              ) : (
                <video
                  src={preview}
                  controls
                  className="max-h-80 w-full rounded-md"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadSection;
