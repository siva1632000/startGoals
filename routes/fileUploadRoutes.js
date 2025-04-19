import express from "express";
import upload from "../middleware/upload.js";
import { uploadFiles } from "../controller/fileUploadController.js";

const router = express.Router();

// Single dynamic upload endpoint
router.post("/upload-file", upload.any(), uploadFiles);

export default router;
