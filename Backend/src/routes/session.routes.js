import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  completeSession,
  getSession,
  scheduleSession,
} from "../controllers/session.controller.js";

const sessionRouter = express.Router();

sessionRouter.get("/", protect, getSession);
sessionRouter.post("/schedule", protect, scheduleSession);
sessionRouter.post("/complete", protect, completeSession);

export default sessionRouter;
