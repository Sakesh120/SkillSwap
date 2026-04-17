import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getActivity } from "../controllers/dashboard.controller.js";

const activityRouter = express.Router();

activityRouter.get("/", protect, getActivity);

export default activityRouter;
