import express from 'express';
import { sendOtp, validateOtp, resendOtp } from '../controller/otpController.js';
import validateInput from '../middlewares/validateInput.js';
import otpRateLimiter from '../middlewares/rateLimiter.js';
import apiKeyAuth from '../middlewares/apiKeyAuth.js';
const otpRoutes = express.Router();
otpRoutes.post('/send-otp', apiKeyAuth ,validateInput, otpRateLimiter, sendOtp);
otpRoutes.post('/verify-otp', apiKeyAuth,validateOtp);
otpRoutes.post('/resend-otp', apiKeyAuth,resendOtp);

export default otpRoutes;
