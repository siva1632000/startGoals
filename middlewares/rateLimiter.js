import rateLimit from 'express-rate-limit';

const otpRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many OTP requests, try again after an hour',
  keyGenerator: (req) => req.body.identifier || req.ip,
});

export default otpRateLimiter;
