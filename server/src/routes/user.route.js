import express from "express";
import {
  getCurrentUser,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const userRouter = express.Router();

/**
 * @route POST /api/v2/register
 * @desc Register a new user
 */
userRouter.post("/register", registerUser);
/**
 * @route POST /api/v2/login
 * @desc Login existing user
 */
userRouter.post("/login", loginUser);
/**
 * @route GET /api/v2/logout
 * @desc Logout existing user
 */
userRouter.get("/logout", logoutUser);
/**
 * @route POST /api/v2/google
 * @desc Login using google
 */
userRouter.post("/google", googleLogin);
/**
 * @route GET /api/v2/logout
 * @desc Logout existing user
 */
userRouter.get("/user", isAuthenticated, getCurrentUser);

export default userRouter;
