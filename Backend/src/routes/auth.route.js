import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * POST /api/auth/register
 */

authRouter.post("/register", protect, register);

/**
 * POST /api/auth/login
 */
authRouter.post("/login", protect, login);

export default authRouter;
