import { Job } from "../models/job.model.js";
import User from "../models/user.model.js";

/* ================= POST JOB ================= */
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= GET ALL JOBS ================= */
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= GET JOB BY ID ================= */
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate("applications");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= GET ADMIN JOBS ================= */
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= SAVE JOB ================= */
export const saveJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const user = await User.findById(userId);

    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
      });
    }

    user.savedJobs.push(jobId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Job saved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving job" });
  }
};

/* ================= UNSAVE JOB ================= */
export const unsaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { savedJobs: jobId },
    });

    return res.status(200).json({
      success: true,
      message: "Job removed from saved jobs",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error unsaving job" });
  }
};
