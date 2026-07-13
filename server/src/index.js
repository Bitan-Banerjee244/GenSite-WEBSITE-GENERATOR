import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import "dotenv/config";
import websiteRouter from "./routes/website.route.js";
import { rateLimit } from "express-rate-limit";
const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  limit: 150,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
   message: {
    success: false,
    message: "Too many requests. Try again later.",
  },
});

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(limiter);

// Routes
app.use("/api/v2", userRouter);
app.use("/api/web", websiteRouter);

// test api
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server is running" });
});

export default app;
