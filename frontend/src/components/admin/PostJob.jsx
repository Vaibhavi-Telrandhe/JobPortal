import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, companyId: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // ✅ Get token from localStorage
      const token = localStorage.getItem("token");
      
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ Add token to header
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.error("Post job error:", error);
      
      // ✅ Handle 401 errors
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to post job");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-md border"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Post a New Job
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <Label>Job Title</Label>
              <Input
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                placeholder="Frontend Developer"
                required
              />
            </div>

            {/* Salary */}
            <div>
              <Label>Salary</Label>
              <Input
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                placeholder="₹8,00,000 / year"
                required
              />
            </div>

            {/* Location */}
            <div>
              <Label>Location</Label>
              <Input
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="Bangalore / Remote"
                required
              />
            </div>

            {/* Job Type */}
            <div>
              <Label>Job Type</Label>
              <Input
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                placeholder="Full-time / Internship"
                required
              />
            </div>

            {/* Experience */}
            <div>
              <Label>Experience Level</Label>
              <Input
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                placeholder="0–2 years"
                required
              />
            </div>

            {/* Positions */}
            <div>
              <Label>No. of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                required
                min="1"
              />
            </div>

            {/* Company Select */}
            <div className="md:col-span-2">
              <Label>Company</Label>
              {companies.length > 0 ? (
                <Select onValueChange={selectChangeHandler} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={company._id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-red-600 mt-2">
                  Please register a company before posting a job.
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Describe the job role..."
                rows={4}
                required
              />
            </div>

            {/* Requirements */}
            <div className="md:col-span-2">
              <Label>Requirements</Label>
              <Textarea
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="React, Node.js, MongoDB, 2 years experience"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8">
            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting job...
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Post Job
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default PostJob;