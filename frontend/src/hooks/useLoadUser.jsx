import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";

const useLoadUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        
        // ✅ Always fetch fresh user data from backend
        const res = await axios.get(`${USER_API_END_POINT}/me`, {
          withCredentials: true,
        });
        
        if (res.data.success) {
          console.log('✅ User loaded from backend:', res.data.user);
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        console.log('❌ Failed to load user, clearing auth:', error.response?.status);
        // Only clear if unauthorized (401), not on network errors
        if (error.response?.status === 401 || error.response?.status === 404) {
          dispatch(setUser(null));
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, []); // ✅ Empty dependency - runs only once on mount
};

export default useLoadUser;