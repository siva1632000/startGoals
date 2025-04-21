import express from "express";
import { createBatch } from "../controller/batchController.js";

const router = express.Router();

// POST /api/batches/create
router.post("/createBatch", createBatch);

export default router;
