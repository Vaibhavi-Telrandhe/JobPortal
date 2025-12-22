import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { Job } from "../models/job.model.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    let profilePhoto =
      "https://res.cloudinary.com/dz1qj3x4h/image/upload/v1709301234/default-profile-photo.png";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto,
        bio: "",
        skills: [],
        resume: "",
        resumeOriginalName: "",
      },
    });

    return res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userFromDb = await User.findOne({ email });
    if (!userFromDb) return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFromDb.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    if (userFromDb.role !== role)
      return res.status(400).json({ success: false, message: "Role mismatch" });

    // ✅ Populate savedJobs with company info
    const user = await User.findById(userFromDb._id)
      .select("-password")
      .populate({
        path: "savedJobs",
        populate: {
          path: "company",
          select: "name logo",
        },
      })
      .lean();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, message: `Welcome back ${user.fullname}`, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

/* ================= SAVE JOB ================= */
export const saveJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.json({ success: true, message: "Job saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving job" });
  }
};

/* ================= UNSAVE JOB ================= */
export const unsaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    // ✅ Use $pull for atomic update
    await User.findByIdAndUpdate(userId, {
      $pull: { savedJobs: jobId },
    });

    res.json({ success: true, message: "Job removed from saved jobs" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error unsaving job" });
  }
};

/* ================= GET SAVED JOBS ================= */
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;

    // ✅ Populate savedJobs with company details
    const user = await User.findById(userId).populate({
      path: "savedJobs",
      populate: { path: "company", select: "name logo" },
    });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, savedJobs: user.savedJobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching saved jobs" });
  }
};

/* ================= GET CURRENT USER ================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id)
      .select("-password")
      .populate({
        path: "savedJobs",
        populate: { path: "company", select: "name logo" },
      });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};
/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  return res
    .cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "strict" })
    .json({ success: true, message: "Logged out successfully" });
};
/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.profile) user.profile = {};

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;

    if (skills) {
      user.profile.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim());
    }

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = req.file.originalname;
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    return res.status(200).json({ success: true, message: "Profile updated successfully", user: userObj });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Profile update failed" });
  }
};
