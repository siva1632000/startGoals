// routes/goalRoutes.js
import express from "express";
import { bulkUploadGoals, getAllGoals } from "../controller/goalController.js";

const router = express.Router();

router.post("/saveAllGoals", bulkUploadGoals);
router.get("/getAllGoals", getAllGoals);

export default router;
