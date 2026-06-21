import Website from "../models/website.model.js";
import generateCode from "../services/generateCode.js";
import { masterPrompt } from "../utils/masterPrompt.js";

/**
 * Clean AI-generated strings safely
 */
const clean = (str) => {
  if (!str) return "";

  return str
    .replace(/\r\n/g, "\n") // Windows line endings
    .replace(/\\n/g, "\n") // escaped newline
    .replace(/\\t/g, "\t") // escaped tab
    .replace(/\\"/g, '"') // escaped quotes
    .replace(/\\\\/g, "\\"); // escaped backslash
};

/**
 * Extra safety: remove leftover escape artifacts in HTML/JS code
 */
const deepCleanCode = (code) => {
  if (!code) return "";

  return code
    .replace(/\\n/g, "\n") // convert \n → newline
    .replace(/\\r/g, "") // remove \r
    .replace(/\\"/g, '"') // fix quotes
    .replace(/\\t/g, "  "); // tabs → spaces
};

/**
 * Safe JSON parsing (handles double stringify)
 */
const safeParseJSON = (data) => {
  try {
    if (typeof data !== "string") return data;

    let parsed = JSON.parse(data);

    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }

    return parsed;
  } catch (err) {
    console.log("JSON Parse Error:", err.message);
    return null;
  }
};

export const generateCodeResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "No Prompt Provided",
      });
    }

    const finalPrompt = masterPrompt.replace("{USER_QUERY}", prompt);

    const response = await generateCode(finalPrompt);

    if (!response) {
      return res.status(500).json({
        success: false,
        message: "No Response Generated",
      });
    }

    const data = safeParseJSON(response);

    if (!data) {
      return res.status(500).json({
        success: false,
        message: "Invalid JSON from AI response",
      });
    }

    const cleanData = {
      title: clean(data.title),
      code: deepCleanCode(data.code),
    };

    const slug = cleanData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .slice(0, 30);

    let website = await Website.create({
      user: req.user,
      code: cleanData.code,
      title: cleanData.title,
      slug: slug,
    });

    return res.status(200).json({
      success: true,
      website,
    });
  } catch (error) {
    console.log("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error Occurred in generating website",
    });
  }
};

export const getAllWebsites = async (req, res) => {
  try {
    let user = req.user;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found ! Please Login",
      });
    }

    let websites = await Website.find({ user });

    if (!websites) {
      return res.status(400).json({
        success: false,
        message: "No Websites found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Websites fetched successfully",
      websites,
    });
  } catch (error) {
    return res.json(500).status({
      success: false,
      message: "Error in fetching websites",
      error: error,
    });
  }
};

export const getWebsitesById = async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is not provided",
      });
    }

    let website = await Website.findById(id);

    if (!website) {
      return res.status(400).json({
        success: false,
        message: "No Website Found",
      });
    }

    return res.status(200).json({
      message: "Website Fetched",
      success: true,
      website,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Website not found! Error occurred in server",
      success: false,
      error: error,
    });
  }
};
