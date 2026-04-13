import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getSession,
  scheduleSession,
} from "../controllers/session.controller.js";

const sessionRouter = express.Router();

sessionRouter.get("/", protect, getSession);
sessionRouter.post("/schedule", protect, scheduleSession);

export default sessionRouter;
