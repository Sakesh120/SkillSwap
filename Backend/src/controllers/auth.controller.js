import express from "express";
import userModel from "../model/user.model.js";

export async function register(req, res) {
  res.send("Register route");
}

export async function login(req, res) {
  res.send("Login route");
}
