import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function register(req, res) {
  const { name, email, password, skillsOffered, skillsWanted } = req.body;
  if (!name || !email || !password || !skillsOffered || !skillsWanted) {
    return res.status(400).send("All fields are required");
  }
  try {
    // Check if user already exists (onlly email)
    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    // Hash password (bcrypt)
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user

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

    res.status(201).json({
      message: "Registration done successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credit: user.credits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

///////////////////////////////// API For Login  the user
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }
  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(400).send("Invlied email");
    }

    const ismatch = await bcrypt.compare(password, user.password);

    if (!ismatch) {
      return res.status(400).json({
        message: "invalied password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "10d" },
    );

    res.status(200).json({
      message: "Login successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      credits: user.credits,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
