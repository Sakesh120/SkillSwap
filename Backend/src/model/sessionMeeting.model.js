import mongoose from "mongoose";

const sessionMeetingSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    hostUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    joinedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "live", "ended", "abandoned"],
      default: "waiting",
    },
    hostJoined: {
      type: Boolean,
      default: false,
    },
    participantJoined: {
      type: Boolean,
      default: false,
    },
    waitingStartedAt: Date,
    expiresAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("SessionMeeting", sessionMeetingSchema);
