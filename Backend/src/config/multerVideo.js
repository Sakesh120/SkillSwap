import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store uploads in Backend/uploads/videos directory
    cb(null, path.resolve(__dirname, "../../uploads/videos"));
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId-timestamp-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, req.user + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter only video files
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "video/mp4",
    "video/quicktime",
    "video/avi",
    "video/mov",
    "video/wmv",
    "video/flv",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

// Configure multer
const uploadVideo = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
});

export default uploadVideo;
