import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Rocket, Globe, ExternalLink } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import GenWeb from "./GenWeb";

function Dashboard() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getAllWebsites();
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 border-b border-zinc-900 bg-black/90 backdrop-blur-md flex items-center justify-between px-6 z-50">
        <div className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 text-transparent bg-clip-text">
          GenSite
        </div>

        <button className="flex items-center gap-2 bg-gradient-to-r bg-white md:px-5 md:py-2 px-3 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-300">
          <Plus size={18} />
          <span
            className="hidden sm:block"
            onClick={()=>navigate("/genweb")}
          >
            New Website
          </span>
        </button>
      </nav>

      <main className="min-h-screen bg-black text-white overflow-x-hidden pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">My Websites</h2>
            <p className="text-zinc-400 mt-2">
              Manage and deploy your AI-generated websites.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-12 h-12 border-4 border-zinc-700 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : websites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-zinc-800 rounded-3xl">
              <Globe size={70} className="text-zinc-600 mb-5" />

              <h3 className="text-2xl font-semibold">
                No Websites Generated Yet
              </h3>

              <p className="text-zinc-500 mt-2 text-center">
                Create your first AI-generated website and it will appear here.
              </p>

              <button
                className="mt-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 rounded-xl hover:scale-105 transition"
                onClick={()=>navigate("/genweb")}
              >
                <Plus size={18} />
                Create Website
              </button>
            </div>
          ) : (
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
              {websites.map((site) => (
                <div
                  key={site._id}
                  className="bg-[#090909] border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
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

                      <button className="flex items-center justify-center gap-1 flex-1 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 transition text-sm font-medium">
                        <Rocket size={14} />
                        Deploy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Dashboard;
