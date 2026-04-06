import express from "express";
import userModel from "../model/user.model.js";

export async function register(req, res) {
  const { name, email, password, skillsOffered, skillsWanted } = req.body;
  if (!name || !email || !password || !skillsOffered || !skillsWanted) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await userModel.create({
      name,
      email,
      password,
      skillsOffered,
      skillsWanted,
    });
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
    res.status(201).json({
      message: "Login done successfully",
      user,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}
