import express from "express";
import userRoutes from "./userRoutes.js";
import otpRoutes from "./otpRoutes.js";

const router = express.Router();

router.use(userRoutes);
router.use(otpRoutes);

export default router;
