import express from "express";
import userRoutes from "./userRoutes.js";
import otpRoutes from "./otpRoutes.js";
import languageRoutes from "./languageRoutes.js";
import skillRoutes from "../routes/skillRoutes.js";
import categories from "../routes/categoryRoutes.js";
const router = express.Router();

router.use(userRoutes);
router.use(otpRoutes);
router.use(languageRoutes);
router.use(skillRoutes);
router.use(categories);

export default router;
