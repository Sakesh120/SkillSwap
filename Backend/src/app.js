import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import matchRouter from "./routes/match.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/match", matchRouter);
export default app;
