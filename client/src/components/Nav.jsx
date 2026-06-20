import { useState } from "react";
import { Coins } from "lucide-react";

function Nav({ setOpen, setOpenSignUp }) {
  // Hooks
  const [user,setUser] = useState(false);

  return (
    <nav className="w-full h-14 z-50 bg-black text-white fixed top-0 left-0 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-14 h-full">
        <div className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 text-transparent bg-clip-text">
          GenSite
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {user && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-900 border border-gray-800 text-[13px] sm:text-[14px] text-gray-200">
              <Coins size={16} className="text-yellow-400" />
              <span className="hidden sm:block">Credits:</span>
              <span className="font-semibold text-white">1000</span>
            </div>
          )}

          {!user && (
            <>
              <button
                className="block md:px-4 p-3 md:py-1.5 rounded-lg text-[11px] md:text-[13px]  text-white border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 transition"
                onClick={() => setOpen(true)}
              >
                Sign in
              </button>

              <button
                className="block p-3 md:px-4 md:py-1.5 rounded-lg text-[11px] md:text-[13px] bg-violet-600 text-white font-medium hover:bg-violet-500 active:scale-[0.98] transition shadow-md shadow-violet-900/30"
                onClick={() => setOpenSignUp(true)}
              >
                Sign up
              </button>
            </>
          )}

          {user && (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 border border-gray-700"></div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
