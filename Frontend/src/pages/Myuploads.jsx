import React, { useState } from "react";
import API from "../api/axios";

function UploadSection() {
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
 

  // Handle file select
  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    // Validate type
    if (!["video/mp4", "video/quicktime"].includes(selectedFile.type)) {
      alert("Only MP4 or MOV allowed");
      return;
    }

    // Validate size (500MB)
    if (selectedFile.size > 500 * 1024 * 1024) {
      alert("File too large (max 500MB)");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0]);
  };

  // Submit
 const handleSubmit = async () => {
  const finalCategory =
    category === "custom" ? customCategory : category;

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

      alert("Upload successful 🚀");

      // Reset
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
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-6 pt-30">
      <div className="w-full max-w-2xl bg-gray-100 rounded-2xl shadow-md p-6">

        <h1 className="text-3xl font-serif text-center mb-6">
          Upload Your Video
        </h1>

        <div className="bg-gray-200 rounded-xl p-6 space-y-6">

          {/* Caption */}
          <div>
            <label className="block text-lg mb-2">Video Caption</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-300 outline-none"
              placeholder="Add a caption..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-lg mb-2">Select Skill Category</label>

           <select
  value={category}
  onChange={(e) => {
    setCategory(e.target.value);
    if (e.target.value !== "custom") {
      setCustomCategory(""); // reset if not custom
    }
  }}
  className="w-full p-3 rounded-md bg-gray-300 outline-none"
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
    className="w-full p-3 rounded-md bg-gray-300 outline-none mt-2"
  />
)}
          </div>

          {/* Upload Box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-300 text-center"
          >
            {!preview ? (
              <>
                <div className="text-4xl mb-2">☁️⬆️</div>
                <p className="text-sm mb-3">Drag & drop or</p>

                <label className="bg-gray-200 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100">
                  Upload Video
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    hidden
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </label>

                <p className="text-xs mt-2">MP4 or MOV, max 500MB</p>
              </>
            ) : (
              <video
                src={preview}
                controls
                className="w-full max-h-60 rounded-md"
              />
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2 bg-gray-300 rounded-full text-lg shadow hover:bg-gray-400 transition"
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UploadSection;