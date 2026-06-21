import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    skillsOffered: String,
    skillRequested: String,
    scheduledAt: Date,
    platform: {
      type: String,
      enum: ["", "ZOOM", "GMEET", "WHATSAPP CALL", "SKILLSWAP"],
      default: "",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "scheduled",
        "live",
        "completed",
        "expired",
        "abandoned",
      ],
      default: "pending",
    },
    sessionRoomId: {
      type: String,
      default: "",
    },
    startNotificationSent: {
      type: Boolean,
      default: false,
    },
    completeBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Session", sessionSchema);
