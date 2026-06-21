import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsRead,
} from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.get("/", protect, getNotifications);
notificationRouter.put("/:id/seen", protect, markNotificationAsRead);
notificationRouter.put("/seen-all", protect, markAllNotificationsRead);

export default notificationRouter;
