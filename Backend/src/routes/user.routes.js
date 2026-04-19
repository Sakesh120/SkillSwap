import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getAllTutorials,
  getOtherProfile,
  getProfile,
  updateProfile,
  uploadTutorial,
} from "../controllers/user.controller.js";
import upload from "../config/multer.js";
import uploadVideo from "../config/multerVideo.js";

const userRouter = express.Router();

userRouter.get("/profile", protect, getProfile);
userRouter.put(
  "/Update-profile",
  protect,
  upload.single("avatar"),
  updateProfile,
);
userRouter.get("/:id/profile", protect, getOtherProfile);
userRouter.post(
  "/upload-tutorial",
  protect,
  uploadVideo.single("video"),
  uploadTutorial,
);
userRouter.get("/tutorials", protect, getAllTutorials);
export default userRouter;
