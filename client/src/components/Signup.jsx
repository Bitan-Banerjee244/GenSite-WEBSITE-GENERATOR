import React, { useState } from "react";
import { X } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/user/userSlice";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../auth/auth";
import { motion } from "motion/react";

function Signup({ setOpenSignUp }) {
  // Hooks && Variables
  let [fullName, setFullName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let dispatch = useDispatch();

  // Functions & States
  const signupUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v2/register`,
        { fullName, email, password },
        { withCredentials: true },
      );

      console.log(response?.data);
      dispatch(setUserData(response?.data?.user));
      toast.success(response?.data?.message);
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const googleLoginUser = async () => {
    try {
      setLoading(true);
      let provider = new GoogleAuthProvider();
      let firebaseResponse = await signInWithPopup(auth, provider);

      let response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v2/google`,
        {
          fullName: firebaseResponse?.user?.displayName,
          email: firebaseResponse?.user?.email,
          avatar: firebaseResponse?.user?.photoURL,
        },
        { withCredentials: true },
      );
      console.log(response?.data);
      toast.success(response?.data?.message);
      dispatch(setUserData(response?.data?.user));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-lg z-50 px-4"
      onClick={() => setOpenSignUp(false)}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/90 p-6 text-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Sign Up</h2>

          <button
            onClick={() => setOpenSignUp(false)}
            className="p-1 rounded-md hover:bg-zinc-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-400 text-sm my-2.5">
          Create your GenSite account
        </p>

        <form className="mt-6 space-y-3" onSubmit={signupUser}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition font-semibold">
            {loading ? "Creating...." : "Create Account"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-700"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-zinc-700"></div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 active:scale-[0.98] transition"
          onClick={googleLoginUser}
        >
          <FaGoogle size={18} />
          Continue with Google
        </button>

        <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </motion.div>
  );
}

export default Signup;
