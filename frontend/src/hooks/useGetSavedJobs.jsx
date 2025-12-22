import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";

const useGetSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, {
          withCredentials: true,
        });
        if (res.data.success) {
          // ✅ Fixed: Use savedJobs from response (not jobs)
          setSavedJobs(res.data.savedJobs || []);
        }
      } catch (error) {
        console.log("Error fetching saved jobs:", error);
        setSavedJobs([]);
      }
    };

    if (user) {
      fetchSavedJobs();
    } else {
      setSavedJobs([]);
    }
  }, [user]);

  return savedJobs;
};

export default useGetSavedJobs;