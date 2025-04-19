// routes/skillRoutes.js
import express from "express";
import {
  bulkUploadSkills,
  getAllSkills,
  getSkillsByGoal,
} from "../controller/skillcontroller.js";

const router = express.Router();

router.post("/saveAllSkills", bulkUploadSkills);
router.get("/getAllSkills", getAllSkills);
router.get("/getSkillsByGoal/:goalId", getSkillsByGoal);

export default router;
