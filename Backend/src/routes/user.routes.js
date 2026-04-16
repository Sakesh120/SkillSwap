import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import upload from "../config/multer.js";

const userRouter = express.Router();

userRouter.get("/profile", protect, getProfile);
userRouter.put(
  "/Update-profile",
  protect,
  upload.single("avatar"),
  updateProfile,
);

export default userRouter;
