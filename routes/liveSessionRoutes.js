import express from "express";
import { createLiveSession } from "../controller/liveSessionController.js";

const router = express.Router();

router.post("/createLiveSession", createLiveSession);

export default router;
