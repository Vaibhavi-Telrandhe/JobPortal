import express from "express";
import {
  login,
  register,
  updateProfile,
  logout,
  saveJob,
  getSavedJobs,
  getMe,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Auth routes
router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", logout);

// User profile
router.get("/me", isAuthenticated, getMe);
router.post("/profile/update", isAuthenticated, singleUpload, updateProfile);

// ⭐ Save / Unsave / Fetch Saved Jobs
router.post("/save-job/:id", isAuthenticated, saveJob); // Save job
router.get("/saved-jobs", isAuthenticated, getSavedJobs); // Get saved jobs

export default router;
