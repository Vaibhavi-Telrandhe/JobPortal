import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  postJob,
  getAllJobs,
  getAdminJobs,
  getJobById,
  saveJob,
  unsaveJob,
} from "../controllers/job.controller.js";

const router = express.Router();

// Job CRUD
router.post("/post", isAuthenticated, postJob);
router.get("/get", isAuthenticated, getAllJobs);
router.get("/getadminjobs", isAuthenticated, getAdminJobs);
router.get("/get/:id", isAuthenticated, getJobById);

// ⭐ Save / Unsave job via job controller
router.post("/:id/save", isAuthenticated, saveJob);     // Save job
router.post("/:id/unsave", isAuthenticated, unsaveJob); // Unsave job

export default router;
