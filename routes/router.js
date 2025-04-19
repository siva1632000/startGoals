import express from "express";
import userRoutes from "./userRoutes.js";
import otpRoutes from "./otpRoutes.js";
import skillRoutes from "./skillRoutes.js";
import categories from "./categoryRoutes.js";
import LanguageRoutes from "./languageRoutes.js";
import onboardingRoutes from "./onboardingRoutes.js";
import goalRoutes from "./goalRoutes.js";
import courseRoutes from "./courseRoutes.js";
import courseLevelRoutes from "./courseLevelRoutes.js";
import sectionRoutes from "./sectionRoutes.js";
import liveSessionRoutes from "./liveSessionRoutes.js";

const router = express.Router();

router.use(userRoutes);
router.use(otpRoutes);
router.use(skillRoutes);
router.use(categories);
router.use(LanguageRoutes);
router.use(onboardingRoutes);
router.use(goalRoutes);
router.use(courseRoutes);
router.use(courseLevelRoutes);
router.use(sectionRoutes);
router.use(liveSessionRoutes);

export default router;
