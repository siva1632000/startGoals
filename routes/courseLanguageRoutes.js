import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  createCourseLanguage,
  getAllCourseLanguages,
  getCourseLanguageById,
  updateCourseLanguage,
  deleteCourseLanguage,
  bulkCreateCourseLanguages,
  getCourseLanguageByCode,
} from "../controllers/courseLanguageController.js";

const router = express.Router();

router.post("/saveCourseLanguage", createCourseLanguage);
router.post("/saveAllCourseLanguage", bulkCreateCourseLanguages);
router.get("/getAllCourseLanguages", getAllCourseLanguages);
router.get("/getCourseLanguageById/:id", getCourseLanguageById);
router.get("/getCourseLanguageByCode/:code", getCourseLanguageByCode);
router.put("/updateCourseLanguageById/:id", updateCourseLanguage);
router.delete("/deleteCourseLanguageById/:id", deleteCourseLanguage);

export default router;
