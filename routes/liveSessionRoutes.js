import express from "express";
import {
  createLiveSession,
  liveSessionCreation,
  createZoomLive,
} from "../controller/liveSessionController.js";

import { generateSignature } from "../config/zoomconfig.js";

const router = express.Router();

router.post("/createLiveSession", createLiveSession);
router.post("/createLive", liveSessionCreation);
router.post("/createZoomLive", createZoomLive);
router.post("/generate-signature", generateSignature);

export default router;
