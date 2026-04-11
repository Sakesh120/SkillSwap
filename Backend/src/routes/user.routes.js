import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile", protect, getProfile);
userRouter.put("/Update-profile", protect, updateProfile);

export default userRouter;
