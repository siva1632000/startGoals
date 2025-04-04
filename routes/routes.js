const express = require('express');
const { sendOtp, validateOtp,resendOtp} = require('../controller/otpController');
const validateInput = require('../middlewares/validateInput');
const otpRateLimiter = require('../middlewares/rateLimiter');

const router = express.Router();
router.post('/send-otp', validateInput, otpRateLimiter, sendOtp);
router.post('/verify-otp', validateOtp);
router.post('/resend-otp', resendOtp);

module.exports = router;
