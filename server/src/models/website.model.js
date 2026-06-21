import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    context: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "ai", "system"],
      default: "user",
    },
  },
  { timestamps: true },
);

const websiteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    chat: [chatSchema],
  },
  { timestamps: true },
);

const Website = mongoose.model("Website", websiteSchema);
export default Website;
