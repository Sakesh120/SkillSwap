import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    skillsOffered: [String],
    skillsWanted: [String],
    credits: {
      type: Number,
      default: 50, // bonus on registration
    },
    rating: { type: Number, default: 0 },
  },

  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
