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
requestRouter.put("/respond/:id", protect, respondRequest);

export default requestRouter;
