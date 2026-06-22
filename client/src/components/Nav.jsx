import { useState } from "react";
import { Coins, CoinsIcon, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "../store/user/userSlice";
import { toast } from "react-hot-toast";

function Nav({ setOpen, setOpenSignUp }) {
  // Hooks
  const user = useSelector((store) => store.user.userData);
  const [popUp, setPopUp] = useState(true);
  let dispatch = useDispatch();

  // Functions and State
  const logOutUser = async () => {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v2/logout`,
        { withCredentials: true },
      );
      dispatch(setUserData(null));
      toast.success(response?.data?.message);
      setPopUp(prev=>!prev);
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };

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

          <div
            className={`${
              popUp ? "hidden" : "block"
            } z-10 absolute top-[60px] right-7 w-54 bg-black rounded-xl shadow-lg border border-gray-100/30 overflow-hidden `}
          >
            {/* Profile Section */}
            <div className="p-4 flex items-center gap-3 border border-solid border-b-2 border-gray-100/30">
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
              <div>
                <p className="font-semibold">{user?.fullName}</p>
              </div>
            </div>

            {/* Credit Section */}
            <div className="p-4 flex justify-between items-center">
              <span className="flex gap-2">
                <CoinsIcon className="text-orange-300" size={18} />
                Credits
              </span>
              <span className="font-bold">1000</span>
            </div>

            {/* Logout */}
            <div className="p-3">
              <button
                className="w-full bg-red-700 hover:bg-red-900 text-white py-2 rounded-lg transition flex justify-center items-center gap-2"
                onClick={logOutUser}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
