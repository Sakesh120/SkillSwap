import userModel from "../model/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function register(req, res) {
  const { name, email, password, skillsOffered, skillsWanted } = req.body;
  if (!name || !email || !password || !skillsOffered || !skillsWanted) {
    return res.status(400).send("All fields are required");
  }

  const existingUser = await userModel.findOne({
    $or: [{ email: email }, { password: password }],
  });

  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  const hashPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  try {
    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
      skillsOffered,
      skillsWanted,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "10d",
      },
    );
    res.cookie("token", token);

    res.status(201).json({
      message: "Registration done successfully",
      user,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

///////////////////////////////// API For Login  the user
export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }
  try {
    const user = await userModel.findOne({
      $and: [{ email: email }, { password: password }],
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "10d",
      },
    );
    res.cookie("token", token);

    res.status(201).json({
      message: "Login done successfully",
      user,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}
