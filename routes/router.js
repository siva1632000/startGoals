import express from "express";
import userRoutes from "./userRoutes.js";
import otpRoutes from "./otpRoutes.js";
import languageRoutes from "./languageRoutes.js";
import skillRoutes from "../routes/skillRoutes.js";

const router = express.Router();

router.use(userRoutes);
router.use(otpRoutes);
router.use(languageRoutes);
router.use(skillRoutes);

export default router;
