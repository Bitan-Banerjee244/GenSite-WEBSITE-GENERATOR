import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateCode = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log("Response is not generated");
    }
    return response.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.log("Error Occurred:", error.message);
  }
};

export default generateCode;
