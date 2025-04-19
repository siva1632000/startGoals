import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { createCourse, getCourseById } from "../controller/courseController.js";

const router = express.Router();

router.post("/uploadCourse", createCourse);
router.get("/getCourseById/:courseId", getCourseById);

export default router;
