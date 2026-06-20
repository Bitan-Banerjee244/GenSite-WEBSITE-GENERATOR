import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, avatar } = req.body;

    if (!fullName || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        message: "User already exists. Please Login!",
        success: false,
      });
    }

    let hashPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      fullName,
      email,
      password: hashPassword,
      avatar,
    });

    let token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully!",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred in register user api.",
      success: false,
      error: error,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exists. Please Signup!",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    let token = generateToken(existingUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successfully!",
      existingUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred in login user api.",
      success: false,
      error: error,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logout Successful !",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred in logout api.",
      success: false,
      error,
    });
  }
};
