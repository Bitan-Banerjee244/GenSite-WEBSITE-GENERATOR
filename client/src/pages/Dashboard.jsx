import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Rocket, Globe, ExternalLink, Share2 } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import GenWeb from "./GenWeb";
import { motion } from "motion/react";
import toast from "react-hot-toast";

function Dashboard() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  const getAllWebsites = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/web/getsite`,
        {
          withCredentials: true,
        },
      );

      setWebsites(response.data.websites || []);
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    getAllWebsites();
  }, [refresh]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 border-b border-zinc-900 bg-black/90 backdrop-blur-md flex items-center justify-between px-6 z-50">
        <motion.div
          className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 text-transparent bg-clip-text"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "tween" }}
        >
          GenSite
        </motion.div>

        <motion.button
          className="flex items-center gap-2 bg-gradient-to-r bg-white md:px-5 md:py-2 px-3 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-300"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "tween" }}
        >
          <Plus size={18} />
          <span className="hidden sm:block" onClick={() => navigate("/genweb")}>
            New Website
          </span>
        </motion.button>
      </nav>

      <main className="min-h-screen bg-black text-white overflow-x-hidden w-full">
        <div className="mt-20 max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            className="mb-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", duration: "0.3" }}
          >
            <h2 className="text-3xl font-bold">My Websites</h2>
            <p className="text-zinc-400 mt-2">
              Manage and deploy your AI-generated websites.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20 md:py-24">
              <div className="w-12 h-12 border-4 border-zinc-700 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : websites.length === 0 ? (
           <div className="w-full max-w-full box-border flex flex-col items-center justify-center py-20 md:py-24 border border-dashed border-zinc-800 rounded-3xl">
              <Globe size={70} className="text-zinc-600 mb-5" />

              <h3 className="text-2xl font-semibold text-center">
                No Websites Generated Yet
              </h3>

              <p className="text-zinc-500 mt-2 text-center">
                Create your first AI-generated website and it will appear here.
              </p>

              <button
                className="mt-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 rounded-xl hover:scale-105 transition"
                onClick={() => navigate("/genweb")}
              >
                <Plus size={18} />
                Create Website
              </button>
            </div>
          ) : (
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
              {websites.map((site, index) => (
                <motion.div
                  key={site._id}
                  className="bg-[#090909] border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="h-44 bg-white overflow-hidden relative border-b border-zinc-800">
                    <div
                      className="absolute inset-0 origin-top-left scale-[0.45]"
                      style={{ width: "222%", height: "222%" }}
                    >
                      <iframe
                        title={site.title}
                        srcDoc={site.code}
                        sandbox="allow-scripts"
                        loading="lazy"
                        scrolling="no"
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="text-sm font-semibold truncate flex-1">
                        {site.title}
                      </h3>

                      <ExternalLink
                        size={16}
                        className="text-zinc-500 hover:text-white cursor-pointer flex-shrink-0"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/showwebsite/${site._id}`)}
                        className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-sm font-medium"
                      >
                        Open
                      </button>

                      {!site.isDeployed && (
                        <button
                          className="flex items-center justify-center gap-1 flex-1 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 transition text-sm font-medium"
                          onClick={() => deployWebsite(site?._id)}
                        >
                          <Rocket size={14} />
                          Deploy
                        </button>
                      )}

                      {site.isDeployed && (
                        <Link
                          className="flex items-center justify-center gap-1 flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 transition text-sm font-medium"
                          to={site?.shareLink}
                          target="_black"
                        >
                          <Share2 size={14} />
                          Share Link
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Dashboard;
