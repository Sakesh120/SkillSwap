import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getOtherProfile,
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import upload from "../config/multer.js";

const userRouter = express.Router();

userRouter.get("/profile", protect, getProfile);
userRouter.put(
  "/Update-profile",
  protect,
  upload.single("avatar"),
  updateProfile,
);
userRouter.get("/:id/profile", protect, getOtherProfile);
export default userRouter;
