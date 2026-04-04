import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const authRouter = Router();

/**
 * POST /api/auth/register
 */

authRouter.post("/register", register);

/**
 * POST /api/auth/login
 */
authRouter.post("/login", login);

export default authRouter;
