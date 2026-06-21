import React, { useState } from "react";
import Nav from "../components/Nav";
import { ArrowRight } from "lucide-react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  let [openLogin, setOpenLogin] = useState(false);
  let [openSignUp, setOpenSignUp] = useState(false);
  let navigate = useNavigate();
  let { userData: user } = useSelector((store) => store.user);

  return (
    <>
      <Nav setOpen={setOpenLogin} setOpenSignUp={setOpenSignUp} />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 pt-16 pb-10 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-violet-600/20 blur-[120px] rounded-full"></div>

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl">
          <div className="mb-2 md:mb-6 px-4 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs sm:text-sm">
            AI Website Builder
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
            Create any website in minutes
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
              using GenSite
            </span>
          </h1>

          <p className="mt-6 max-w-md md:max-w-xl px-2 text-gray-400 text-sm md:text-lg leading-relaxed">
            Build modern websites instantly with AI-powered generation,
            beautiful interfaces, and clean code.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
            <button
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-all duration-300"
              onClick={() => {
                if (!user) {
                  setOpenLogin(true);
                } else {
                  navigate("/dashboard");
                }
              }}
            >
              Explore Now
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Other Pages */}
      {openLogin && <Login setOpen={setOpenLogin} />}
      {openSignUp && <Signup setOpenSignUp={setOpenSignUp} />}
    </>
  );
}

export default Home;
