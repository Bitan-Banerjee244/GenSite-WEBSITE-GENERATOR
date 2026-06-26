import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";
import { useDispatch } from "react-redux";
import { toggleRefresh } from "../store/user/userSlice";

function GenWeb() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("");
  let dispatch = useDispatch();

  const navigate = useNavigate();

  const messages = [
    "Analyzing your idea...",
    "Designing UI structure...",
    "Generating components...",
    "Writing clean HTML,CSS & JS...",
    "Adding animations...",
    "Optimizing responsive layout...",
    "Finalizing website...",
  ];

  const simulateProgress = () => {
    let i = 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });

      setStepText(messages[i % messages.length]);
      i++;
    }, 1000);
  };

  const generateWebsite = async () => {
    if (!prompt) return;
    setLoading(true);
    setProgress(10);
    setStepText("Starting generation...");
    simulateProgress();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/web/gensite`,
        { prompt },
        { withCredentials: true },
      );
      setProgress(100);
      setStepText("Completed!");
      toast.success(res?.data?.message);
      dispatch(toggleRefresh());
      setTimeout(() => {
        navigate(`/showwebsite/${res?.data?.website?._id || res.data._id}`);
      }, 800);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setProgress(0);
      setStepText("Error generating website");
      console.log(err);
      toast.error(
        err?.response?.data?.message || "Something Went wrong please try again",
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {!loading ? (
        <div className="w-full max-w-2xl">
          <motion.h1
            className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            AI Website Generator
          </motion.h1>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your website idea... (e.g. modern portfolio for developer)"
            className="w-full h-40 p-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 outline-none"
          />

          <motion.button
            onClick={generateWebsite}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.05] transition font-semibold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Generate Website
          </motion.button>

          <motion.div
            className="text-center mt-6 text-sm text-gray-400"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>
              Each website creation costs{" "}
              <span className="font-semibold text-yellow-400">100 Credits</span>
            </p>

            <p className="mt-2">
              Each website update costs{" "}
              <span className="font-semibold text-yellow-400">50 Credits</span>
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="w-full max-w-xl text-center">
          <h2 className="text-2xl font-semibold mb-6 text-purple-400">
            Generating Your Website
          </h2>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-zinc-300 animate-pulse">{stepText}</p>

          {/* Loading animation dots */}
          <div className="flex justify-center gap-2 mt-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300"></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenWeb;
