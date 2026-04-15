import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { giveRating } from "../controllers/rating.controller.js";

const ratingRouter = express.Router();

ratingRouter.post("/", protect, giveRating);

export default ratingRouter;
