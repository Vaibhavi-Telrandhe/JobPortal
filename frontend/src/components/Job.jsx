import React, { useState } from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  
  // ✅ Check if job is already saved
  const [isSaved, setIsSaved] = useState(
    user?.savedJobs?.some((savedJob) => savedJob._id === job._id) || false
  );
  const [loading, setLoading] = useState(false);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const handleSaveJob = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking save button

    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      
      if (isSaved) {
        // Unsave job
        const res = await axios.post(
          `${JOB_API_END_POINT}/${job._id}/unsave`,
          {},
          { withCredentials: true }
        );
        
        if (res.data.success) {
          setIsSaved(false);
          toast.success("Job removed from saved jobs");
        }
      } else {
        // Save job
        const res = await axios.post(
          `${JOB_API_END_POINT}/${job._id}/save`,
          {},
          { withCredentials: true }
        );
        
        if (res.data.success) {
          setIsSaved(true);
          toast.success("Job saved successfully");
        }
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        
        {/* ✅ Save/Unsave Button */}
        <Button
          onClick={handleSaveJob}
          disabled={loading}
          variant="outline"
          className="rounded-full"
          size="icon"
        >
          <Bookmark
            className={isSaved ? "fill-current text-blue-600" : ""}
          />
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Avatar className="w-10 h-10">
          <AvatarImage src={job?.company?.logo} />
        </Avatar>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">
          {job?.description?.substring(0, 100)}...
        </p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default Job;