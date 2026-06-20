import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Routes
app.use("/api/v2",userRouter);

// test api
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server is running" });
});

export default app;
