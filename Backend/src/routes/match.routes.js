import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMatches } from "../controllers/match.controller.js";

const matchRouter = express.Router();

matchRouter.get("/", protect, getMatches);

export default matchRouter;
