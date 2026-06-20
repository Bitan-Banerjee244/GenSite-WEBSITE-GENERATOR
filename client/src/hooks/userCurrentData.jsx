import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "../store/user/userSlice";

const useCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v2/user`,
          { withCredentials: true },
        );
        dispatch(setUserData(response?.data?.user));
        console.log(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getCurrentUser();
  }, [dispatch]);
};

export default useCurrentUser;
