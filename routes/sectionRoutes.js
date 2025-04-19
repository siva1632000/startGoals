import express from "express";
import {
  createSection,
  updateSectionById,
  getSectionsByCourseId,
  getSectionById,
} from "../controller/sectionController.js";

const router = express.Router();

router.post("/uploadSection", createSection); // Create section
router.put("/updateSectionById/:sectionId", updateSectionById); // Update section
router.get("/getSectionsByCourseId/:courseId", getSectionsByCourseId); // Get all sections for a course
router.get("/getSectionById/:sectionId", getSectionById); // Get single section by ID

export default router;
