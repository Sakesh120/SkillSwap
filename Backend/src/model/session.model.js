import mongoose, { mongo } from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    skillsOffered: String,
    skillsWanted: String,
    scheduledAt: Date,
    status: {
      type: String,
      enum: ["pending", "scheduled", "completed"],
      default: "pending",
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
