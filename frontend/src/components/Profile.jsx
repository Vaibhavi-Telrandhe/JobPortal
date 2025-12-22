import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import useGetSavedJobs from "@/hooks/useGetSavedJobs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const Profile = () => {
  useGetAppliedJobs();
  const initialSavedJobs = useGetSavedJobs();
  const { user, loading } = useSelector((store) => store.auth) || {};
  const [open, setOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  const skills = user?.profile?.skills || [];

  useEffect(() => {
    setSavedJobs(initialSavedJobs || []);
  }, [initialSavedJobs]);

  const goToJobDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleUnsave = async (jobId, e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/job/${jobId}/unsave`,
        {},
        { withCredentials: true }
      );
      
      if (res.data.success) {
        setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
        toast.success("Job removed from saved jobs");
      }
    } catch (err) {
      console.error("Error unsaving job:", err);
      toast.error("Failed to remove job");
    }
  };

  // ✅ Show loading state
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto bg-white border rounded-2xl my-5 p-8">
          <div className="animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ If no user data, show message
  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto bg-white border rounded-2xl my-5 p-8 text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* User Info */}
      <div className="max-w-4xl mx-auto bg-white border rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  user?.profile?.profilePhoto ||
                  "https://tse1.mm.bing.net/th/id/OIP.afQdiNPi7rhMZnP6xqoyLwHaHa"
                }
              />
            </Avatar>

            <div>
              <h1 className="font-medium text-xl">
                {user?.fullname || "No Name"}
              </h1>
              <p>{user?.profile?.bio || "No bio added."}</p>
            </div>
          </div>

          <Button onClick={() => setOpen(true)} variant="outline">
            <Pen />
          </Button>
        </div>

        {/* Contact Info */}
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user?.email || "No email"}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{user?.phoneNumber || "No phone number"}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="my-5">
          <h1>Skills</h1>
          <div className="flex gap-1 flex-wrap">
            {skills.length > 0 ? (
              skills.map((skill, idx) => <Badge key={idx}>{skill}</Badge>)
            ) : (
              <span className="text-gray-500">No skills added.</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="grid gap-1.5">
          <Label className="font-bold">Resume</Label>
          {user?.profile?.resume ? (
            <a
              href={user.profile.resume}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              {user.profile.resumeOriginalName || "View Resume"}
            </a>
          ) : (
            <span className="text-gray-500">NA</span>
          )}
        </div>
      </div>

      {/* Applied Jobs */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4">
        <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      {/* Saved Jobs */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl mt-6 p-4">
        <h1 className="font-bold text-lg my-3">Saved Jobs</h1>
        {savedJobs.length > 0 ? (
          <ul className="space-y-3">
            {savedJobs.map((job) => (
              <li
                key={job._id}
                onClick={() => goToJobDetails(job._id)}
                className="border p-3 rounded-md cursor-pointer flex justify-between hover:bg-gray-50"
              >
                <div>
                  <h2 className="font-semibold">{job.title}</h2>
                  <p className="text-sm text-gray-600">
                    {job?.company?.name || "Unknown Company"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={(e) => handleUnsave(job._id, e)}
                >
                  Unsave
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No saved jobs yet.</p>
        )}
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;