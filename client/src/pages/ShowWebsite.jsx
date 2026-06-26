import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Send,
  Bot,
  Globe,
  Maximize2,
  Code,
  Rocket,
  X,
  MessageCircle,
  Share2,
} from "lucide-react";
import axios from "axios";
import { GoDotFill } from "react-icons/go";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCurrentWebsite } from "../store/web/webSlice";
import { toggleRefresh } from "../store/user/userSlice";

function ShowWebsite() {
  // Hooks
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", text: "Hi 👋, describe your website idea." },
  ]);
  let { id } = useParams();
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("AI Generated Website");
  const [website, setWebsite] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [loading, setLoading] = useState(false);
  let dispatch = useDispatch();

  // Functions and States
  const handleSend = () => {
    if (!input.trim()) return;
    updateWebsite(website?._id);
  };

  const fetchWebsite = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/web/getsitebyid/${id}`,
        { withCredentials: true },
      );

      const website = response?.data?.website;

      setWebsite(website || null);
      // console.log(response?.data);
      dispatch(setCurrentWebsite(website || null));
      setCode(website?.code || "");
      setTitle(website?.title || "AI Generated Website");

      const formattedChat = (website?.chat || []).map((msg) => ({
        role: msg.role,
        text: msg.text || msg.context || "",
      }));

      // setMessages((prev) => [...prev, ...formattedChat]);
      setMessages([
        { role: "system", text: "Hi 👋, describe your website idea." },
        ...formattedChat,
      ]);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deployWebsite = async (id) => {
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/web/site/${id}`,
        {},
        { withCredentials: true },
      );
      console.log(response?.data);
      toast.success(response?.data?.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // http://localhost:3000/api/web/update/6a3cb62db7e2909e56f526fb
  const updateWebsite = async (id) => {
    const userMessage = input.trim();

    if (!userMessage || loading) return;

    try {
      setLoading(true);

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/web/update/${id}`,
        {
          prompt: userMessage,
        },
        {
          withCredentials: true,
        },
      );

      const aiMessage =
        response.data.website.chat.filter((m) => m.role === "ai").at(-1)
          ?.context || "Website updated successfully.";

      setInput("");

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: userMessage,
        },
        {
          role: "ai",
          text: aiMessage,
        },
      ]);
      dispatch(setCurrentWebsite(response?.data?.website));
      setCode(response.data.website.code);
      setWebsite(response.data.website);
      setTitle(response.data.website.title);
      dispatch(toggleRefresh());
      
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsite();
  }, [refresh]);

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden">
      {/* Full Screen Mode*/}
      {isFull ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          {/* TOP BAR */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-900">
            <motion.h1
              className="font-semibold flex gap-2 items-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Globe size={18} /> {title}
            </motion.h1>

            <motion.div
              className="flex gap-2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => setShowEditor(true)}
                className="px-3 py-1 bg-gray-900 rounded"
              >
                Code
              </button>

              <button
                onClick={() => setIsFull(false)}
                className="px-3 py-1 bg-gray-900 rounded"
              >
                Exit
              </button>
            </motion.div>
          </div>

          {/* PREVIEW AREA */}
          <div className="flex-1 relative">
            <iframe
              title="preview"
              srcDoc={code}
              className="w-full h-full bg-white"
              sandbox="allow-scripts"
            />

            {/* RIGHT EDITOR */}
            <AnimatePresence>
              {showEditor && (
                <motion.div
                  className="absolute top-0 right-0 h-full w-[90%] sm:w-[75%] md:w-[60%] lg:w-[45%] bg-black border-l border-gray-800 z-50 flex flex-col"
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                    <span>Code Editor</span>

                    <button
                      onClick={() => setShowEditor(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* MONACO */}
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      width="100%"
                      language="html"
                      theme="vs-dark"
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      options={{
                        minimap: {
                          enabled: false,
                        },
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Normal Mode */
        <div className="flex h-screen w-full ">
          {/* LEFT CHAT */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                className={` w-full md:w-[25%] border-r border-gray-900 flex flex-col`}
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between p-4">
                  {/* Header */}
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 text-transparent bg-clip-text">
                    GenSite
                  </h1>

                  <X
                    className="text-white w-6 h-6 md:hidden hover:bg-red-800 cursor-pointer"
                    onClick={() => setShowChat(false)}
                  />
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`px-3 py-2 rounded-lg text-sm max-w-[85%] ${
                        msg.role === "user"
                          ? "ml-auto bg-blue-600"
                          : "mr-auto bg-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {loading && (
                    <div className="mr-auto bg-gray-800 px-4 py-3 rounded-lg w-fit">
                      <div className="flex items-center gap-1">
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: 0,
                          }}
                        />

                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: 0.15,
                          }}
                        />

                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: 0.3,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* INPUT */}
                <div className="p-3 border-t border-gray-900 flex gap-2">
                  <input
                    value={input}
                    disabled={loading}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Describe your website..."
                    className="flex-1 px-3 py-2 rounded-md bg-black border border-gray-800 outline-none text-sm disabled:opacity-50"
                  />
                  <button
                    disabled={loading}
                    onClick={() => updateWebsite(website?._id)}
                    className="bg-blue-600 px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT PREVIEW */}
          <div className="w-full md:w-[75%] flex flex-col">
            {/* TOP BAR */}
            <div className="flex md:flex-row flex-col gap-5 md:items-center justify-between px-2 md:px-4 py-3 border-b border-gray-900">
              <motion.div
                className="flex justify-between px-2 md:block"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Globe size={18} />
                  <h1 className="font-semibold">{title}</h1>
                </div>
                <p className="text-xs md:mt-2 text-red-400 flex gap-1 items-center">
                  <GoDotFill />
                  Live Preview
                </p>
              </motion.div>

              <motion.div
                className="flex gap-2 flex-wrap"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <button
                  className="md:hidden px-3 py-1 bg-gray-900 rounded flex justify-center items-center gap-2"
                  onClick={() => setShowChat(true)}
                >
                  <MessageCircle size={14} />
                  Chat
                </button>
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-3 py-1 bg-gray-900 rounded flex justify-center items-center gap-2"
                >
                  <Code size={14} />
                  Code
                </button>

                <button
                  onClick={() => setIsFull(true)}
                  className="px-3 py-1 bg-gray-900 rounded flex justify-center items-center gap-2"
                >
                  <Maximize2 size={14} />
                  Full
                </button>

                {!website?.isDeployed && (
                  <button
                    className="flex items-center justify-center gap-1 flex-1 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 transition text-sm font-medium px-2"
                    onClick={() => deployWebsite(website?._id)}
                  >
                    <Rocket size={14} />
                    Deploy
                  </button>
                )}

                {website?.isDeployed && (
                  <Link
                    className="flex items-center justify-center gap-1 flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 transition text-sm font-medium px-3"
                    to={website?.shareLink}
                    target="_black"
                  >
                    <Share2 size={14} />
                    Share Link
                  </Link>
                )}
              </motion.div>
            </div>

            {/* PREVIEW */}
            <div className="flex-1 relative">
              <iframe
                title="preview"
                srcDoc={code}
                className="w-full h-full bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />

              {/* RIGHT SLIDING EDITOR */}
              <AnimatePresence>
                {showEditor && (
                  <motion.div
                    className="absolute top-0 right-0 h-full w-full md:w-[65%] bg-black border-l border-gray-800 z-50 flex flex-col"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between pr-3 border-b border-gray-800">
                      <div className="flex items-center justify-between px-2 w-full">
                        <span className="text-sm bg-slate-950 h-full p-2 px-5 rounded-[10px_10px_0px_0px]">
                          index.html
                        </span>
                        <span className="text-sm">Code Editor</span>
                      </div>
                      <button
                        onClick={() => setShowEditor(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex-1">
                      <Editor
                        height="100%"
                        width="100%"
                        language="html"
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        options={{
                          minimap: {
                            enabled: false,
                          },
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowWebsite;
