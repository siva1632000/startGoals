import express from "express";
import {
  bulkUploadCourseLevels,
  getAllCourseLevels,
  getCourseLevelById,
} from "../controller/courseLevelController.js";

const router = express.Router();

// Bulk upload course levels
router.post("/course-levels/bulk-upload", bulkUploadCourseLevels);

// Get all course levels
router.get("/course-levels", getAllCourseLevels);

// Get course level by ID
router.get("/course-levels/:levelId", getCourseLevelById);

export default router;
