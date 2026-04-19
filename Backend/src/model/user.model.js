import mongoose, { MongooseError } from "mongoose";

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
    rating: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        rate: Number,
        review: String,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    avatar: {
      image: String,
    },
    about: {
      type: String,
      default: "I am a new User of SkillSwap",
    },
    tagline: {
      type: String,
      default: "Knowledge TO Share",
    },
    tutorials: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
