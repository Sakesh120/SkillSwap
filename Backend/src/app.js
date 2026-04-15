import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import matchRouter from "./routes/match.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import requestRouter from "./routes/request.routes.js";
import sessionRouter from "./routes/session.routes.js";
import ratingRouter from "./routes/rating.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/match", matchRouter);
app.use("/api/users", userRouter);
app.use("/api/request", requestRouter);
app.use("/api/session", sessionRouter);
app.use("/api/rating", ratingRouter);

export default app;
