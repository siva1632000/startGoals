import express from "express";
import {
  sendOtp,
  validateOtp,
  resendOtp,
} from "../controller/otpController.js";
import validateInput from "../middleware/validateInput.js";
import otpRateLimiter from "../middleware/rateLimiter.js";
import apiKeyAuth from "../middleware/apiKeyAuth.js";
const otpRoutes = express.Router();
otpRoutes.post("/send-otp", apiKeyAuth, validateInput, otpRateLimiter, sendOtp);
otpRoutes.post("/verify-otp", apiKeyAuth, validateOtp);
otpRoutes.post("/resend-otp", apiKeyAuth, resendOtp);

export default otpRoutes;
