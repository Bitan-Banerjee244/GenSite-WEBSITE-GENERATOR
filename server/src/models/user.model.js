import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: [5, "Password must be Minimum 5 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },
    credits: {
      type: Number,
      default: 1000,
    },
  },
  { timestamps: true },
);
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
