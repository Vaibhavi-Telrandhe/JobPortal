import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import api from "@/utils/axios";

const useLoadUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        const res = await api.get("/user/me");
        
        if (res.data.success) {
          dispatch(setUser(res.data.user));
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(setUser(null));
      }
    };

    loadUser();
  }, [dispatch]);
};

export default useLoadUser;