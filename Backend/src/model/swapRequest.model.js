import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    skillOffered: String,
    skillWanted: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("SwapRequest", swapRequestSchema);
