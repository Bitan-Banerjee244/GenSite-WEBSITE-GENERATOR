import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoading, setUserData } from "../store/user/userSlice";
import { toast } from "react-hot-toast";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  let refresh = useSelector((store) => store.user.refreshPage);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v2/user`,
          { withCredentials: true },
        );
        dispatch(setUserData(response?.data?.user));
        console.log(response.data.user);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
        dispatch(setLoading(false));
      }
    };

    getCurrentUser();
  }, [dispatch, refresh]);
};

export default useCurrentUser;
