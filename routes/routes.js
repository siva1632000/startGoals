import express from 'express';
import { sendOtp, validateOtp, resendOtp } from '../controller/otpController.js';
import validateInput from '../middlewares/validateInput.js';
import otpRateLimiter from '../middlewares/rateLimiter.js';

const router = express.Router();
router.post('/send-otp', validateInput, otpRateLimiter, sendOtp);
router.post('/verify-otp', validateOtp);
router.post('/resend-otp', resendOtp);

export default router;
