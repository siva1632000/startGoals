import express from 'express';
import { sendOtp, validateOtp, resendOtp } from '../controller/otpController.js';
import validateInput from '../middlewares/validateInput.js';
import otpRateLimiter from '../middlewares/rateLimiter.js';
import apiKeyAuth from '../middlewares/apiKeyAuth.js';
const router = express.Router();
router.post('/send-otp', apiKeyAuth ,validateInput, otpRateLimiter, sendOtp);
router.post('/verify-otp', apiKeyAuth,validateOtp);
router.post('/resend-otp', apiKeyAuth,resendOtp);

export default router;
