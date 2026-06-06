import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  completeSession,
  getSession,
  getSessionById,
  scheduleSession,
  updateSessionPlatform,
} from "../controllers/session.controller.js";

const sessionRouter = express.Router();

sessionRouter.get("/", protect, getSession);
sessionRouter.get("/:sessionId", protect, getSessionById);
sessionRouter.post("/schedule", protect, scheduleSession);
sessionRouter.post("/platform", protect, updateSessionPlatform);
sessionRouter.post("/complete", protect, completeSession);

export default sessionRouter;
