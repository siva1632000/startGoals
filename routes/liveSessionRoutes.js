import express from "express";
import {
  createLiveSession,
  liveSessionCreation,
  createZoomLive,
} from "../controller/liveSessionController.js";

const router = express.Router();

router.post("/createLiveSession", createLiveSession);
router.post("/createLive", liveSessionCreation);
router.post("/createZoomLive", createZoomLive);

export default router;
