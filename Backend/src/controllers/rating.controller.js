import mongoose from "mongoose";
import Session from "../model/session.model.js";
import userModel from "../model/user.model.js";

export const giveRating = async (req, res) => {
  try {
    const { sessionId, rate, review, targetUserId } = req.body;

    // Validate input
    if (!sessionId || rate === undefined || !targetUserId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const parsedRate = Number(rate);
    if (!Number.isFinite(parsedRate) || parsedRate < 1 || parsedRate > 5) {
      return res.status(400).json({
        message: "Rate must be a number between 1 and 5",
      });
    }

    // Find session
    const session = await Session.findById(sessionId);

    if (!session || session.status !== "completed") {
      return res.status(400).json({
        message: "Session not completed",
      });
    }

    //  Check user is part of session
    if (!session.users.some((user) => user.toString() === req.user)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const otherParticipant = session.users.find(
      (uid) => uid.toString() !== String(req.user),
    );
    if (
      !otherParticipant ||
      otherParticipant.toString() !== String(targetUserId)
    ) {
      return res.status(400).json({
        message: "Rating must be for the other participant in this session",
      });
    }

    //  Prevent self rating
    if (String(req.user) === String(targetUserId)) {
      return res.status(400).json({
        message: "Cannot rate yourself",
      });
    }

    //  Find target user
    const targetUser = await userModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "Target user not found",
      });
    }

    //  Ensure rating array exists and remove any invalid entries
    if (!Array.isArray(targetUser.rating)) {
      targetUser.rating = [];
    } else {
      targetUser.rating = targetUser.rating.filter(
        (entry) => entry && typeof entry === "object",
      );
    }

    //  Prevent multiple ratings
    const alreadyRated = targetUser.rating.some(
      (r) => r.user && r.user.toString() === req.user,
    );

    if (alreadyRated) {
      return res.status(400).json({
        message: "You already rated this user",
      });
    }

    //  Add rating
    targetUser.rating.push({
      user: new mongoose.Types.ObjectId(req.user),
      rate: parsedRate,
      review: review,
    });

    //  Calculate average safely
    const total = targetUser.rating.reduce(
      (acc, curr) => acc + (curr.rate || 0),
      0,
    );

    targetUser.averageRating =
      targetUser.rating.length > 0 ? total / targetUser.rating.length : 0;

    //  Save user
    await targetUser.save();

    res.json({
      message: "Rating submitted successfully",
      targetUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
