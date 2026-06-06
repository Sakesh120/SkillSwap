import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getChatHistory,
  postChatMessage,
} from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/:sessionId", protect, getChatHistory);
chatRouter.post("/:sessionId", protect, postChatMessage);

export default chatRouter;
