import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getReceivedRequests,
  respondRequest,
  sendRequest,
  deleteRequest,
} from "../controllers/request.controller.js";

const requestRouter = express.Router();

requestRouter.post("/send", protect, sendRequest);
requestRouter.get("/received", protect, getReceivedRequests);
requestRouter.put("/:id/respond", protect, respondRequest);
requestRouter.delete("/delete/:id", protect, deleteRequest);

export default requestRouter;
