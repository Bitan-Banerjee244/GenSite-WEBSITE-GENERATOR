import { useEffect, useRef, useState } from "react";
import { Coins, CoinsIcon, CreditCard, Key, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "../store/user/userSlice";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { setCurrentWebsite } from "../store/web/webSlice";

function Nav({ setOpen, setOpenSignUp }) {
  // Hooks
  const user = useSelector((store) => store.user.userData);
  const [popUp, setPopUp] = useState(false);
  const popupRef = useRef(null);
  let dispatch = useDispatch();

  // Functions and State
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopUp(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logOutUser = async () => {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v2/logout`,
        { withCredentials: true },
      );
      dispatch(setUserData(null));
      dispatch(setCurrentWebsite(null));
      toast.success(response?.data?.message);
      setPopUp((prev) => !prev);
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <nav className="w-full h-14 z-50 bg-black text-white fixed top-0 left-0 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-14 h-full">
        <motion.div
          className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 text-transparent bg-clip-text"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "tween" }}
        >
          GenSite
        </motion.div>

        <motion.div
          className="flex items-center gap-3 md:gap-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "tween", duration: "0.5", delay: "0.2" }}
        >
          {user && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-900 border border-gray-800 text-[13px] sm:text-[14px] text-gray-200">
              <Coins size={16} className="text-yellow-400" />
              <span className="hidden sm:block">Credits:</span>
              <span className="font-semibold text-white">{user?.credits}</span>
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

          {user && user?.avatar == "" && (
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 border border-gray-700 flex justify-center items-center cursor-pointer"
              onClick={() => setPopUp((prev) => !prev)}
            >
              {user?.fullName[0]}
            </div>
          )}

          {user && user?.avatar != "" && (
            <img
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 border border-gray-700 flex justify-center items-center cursor-pointer`}
              src={user?.avatar}
              onClick={() => setPopUp((prev) => !prev)}
            />
          )}

          <AnimatePresence>
            {popUp && (
              <motion.div
                ref={popupRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[60px] right-4 z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
              >
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => navigate("/apikey")}
                    className="
            w-full flex items-center gap-3
            px-4 py-3 rounded-xl
            hover:bg-white/10
            transition-all duration-200
          "
                  >
                    <Key size={18} className="text-cyan-400" />
                    <span>Add API Key</span>
                  </button>

                  <button
                    onClick={() => navigate("/purchase-credits")}
                    className="
            w-full flex items-center gap-3
            px-4 py-3 rounded-xl
            hover:bg-white/10
            transition-all duration-200
          "
                  >
                    <CreditCard size={18} className="text-yellow-400" />
                    <span>Purchase Credits</span>
                  </button>

                  <div className="h-px bg-white/10 my-1" />

                  <button
                    onClick={logOutUser}
                    className="
            w-full flex items-center gap-3
            px-4 py-3 rounded-xl
            text-red-400
            hover:bg-red-500/10
            transition-all duration-200
          "
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </nav>
  );
}

export default Nav;
