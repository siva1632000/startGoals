// routes/onboardingRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  selectLanguages,
  selectGoal,
  selectSkills,
} from "../controller/onboardingController.js";

const router = express.Router();

router.post("/users/languages/:userId", selectLanguages); // API to select languages
router.post("/users/goal/:userId", selectGoal); // API to select goal
router.post("/users/skills/:userId", selectSkills); // API to select skills

export default router;
