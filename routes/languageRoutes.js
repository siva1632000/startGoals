import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  deleteCourseLanguage,
  uploadLanguagesBulk,
  getAllLanguages,
} from "../controller/languageController.js";

const router = express.Router();

router.post("/saveAllLanguage", uploadLanguagesBulk);
router.get("/getAllLanguage", getAllLanguages);
router.delete("/deleteCourseLanguageById/:id", deleteCourseLanguage);

export default router;
