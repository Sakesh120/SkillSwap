import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getReceivedRequests,
  respondRequest,
  sendRequest,
} from "../controllers/request.controller.js";

const requestRouter = express.Router();

requestRouter.post("/send", protect, sendRequest);
requestRouter.get("/received", protect, getReceivedRequests);
requestRouter.put("/:id/respond", protect, respondRequest);
requestRouter.delete("/delete/:id", protect, respondRequest); /// ERRor durin the post man

export default requestRouter;
