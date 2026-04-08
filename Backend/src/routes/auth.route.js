import { Router } from "express";
import { login, register, getUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * POST /api/auth/register
 */

authRouter.post("/register", register);

/**
 * POST /api/auth/login
 */
authRouter.post("/login", login);

/**
 * GET /api/auth/me
 */
authRouter.get("/me", protect, getUser);

export default authRouter;
