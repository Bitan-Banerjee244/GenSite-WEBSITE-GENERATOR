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
} from "lucide-react";
import axios from "axios";
import { GoDotFill } from "react-icons/go";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

function ShowWebsite() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", text: "Hi 👋, describe your website idea." },
  ]);

  let { id } = useParams();
  console.log(id);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("AI Generated Website");

  const [isFull, setIsFull] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const handleSend = () => {
    if (!input.trim()) return;
    setInput("");
  };

  const fetchWebsite = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/web/getsitebyid/${id}`,
        { withCredentials: true },
      );

      const website = response?.data?.website;

      setCode(website?.code || "");
      setTitle(website?.title || "AI Generated Website");

      const formattedChat = (website?.chat || []).map((msg) => ({
        role: msg.role,
        text: msg.text || msg.context || "",
      }));

      setMessages((prev) => [...prev, ...formattedChat]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWebsite();
  }, []);

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden">
      {/* Full Screen Mode*/}
      {isFull ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          {/* TOP BAR */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-900">
            <h1 className="font-semibold">{title}</h1>

            <div className="flex gap-2">
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
            </div>
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
          {/* ${showChat ? "w-full md:w-[25%]" : "hidden md:w-[25%] md:flex"} */}
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
                </div>

                {/* INPUT */}
                <div className="p-3 border-t border-gray-900 flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Describe your website..."
                    className="flex-1 px-3 py-2 rounded-md bg-black border border-gray-800 outline-none text-sm"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-blue-600 px-3 py-2 rounded-md"
                  >
                    <Send size={16} />
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
                transition={{ delay: 0.5 }}
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

                <button className="px-3 py-1 bg-blue-600 rounded flex justify-center items-center gap-2">
                  <Rocket size={14} />
                  Deploy
                </button>
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
