import express from "express";
import {
  createLiveSession,
  liveSessionCreation,
} from "../controller/liveSessionController.js";

const router = express.Router();

router.post("/createLiveSession", createLiveSession);
router.post("/createLive", liveSessionCreation);

export default router;
