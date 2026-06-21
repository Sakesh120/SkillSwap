import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  completeSession,
  createSessionRoom,
  getSession,
  getSessionById,
  getSessionByRoomId,
  scheduleSession,
  updateSessionPlatform,
} from "../controllers/session.controller.js";

const sessionRouter = express.Router();

sessionRouter.get("/", protect, getSession);
sessionRouter.get("/:sessionId", protect, getSessionById);
sessionRouter.get("/room/:roomId", protect, getSessionByRoomId);
sessionRouter.post("/schedule", protect, scheduleSession);
sessionRouter.post("/platform", protect, updateSessionPlatform);
sessionRouter.post("/create-room", protect, createSessionRoom);
sessionRouter.post("/complete", protect, completeSession);

export default sessionRouter;
