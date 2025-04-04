const generateOtp = require('../utils/generateOtp');
const { createOtpEntry, verifyOtp, getLastSentTime } = require('../model/otpModel');
const { sendEmailOtp, sendSmsOtp } = require('../utils/sendOtp');

async function sendOtp(req, res) {
  const { identifier, method } = req.body;

  const lastSent = await getLastSentTime(identifier);
  if (lastSent) {
    const now = new Date();
    const diff = (now - lastSent) / 1000;
    if (diff < 60) {
      return res.status(429).json({ error: `Please wait ${60 - Math.floor(diff)} seconds before retrying` });
    }
  }

  const otp = generateOtp();
  await createOtpEntry(identifier, otp);

  try {
    if (method === 'email') await sendEmailOtp(identifier, otp);
    else await sendSmsOtp(identifier, otp);
    res.json({ message: `OTP sent via ${method}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}

async function validateOtp(req, res) {
  const { identifier, otp } = req.body;
  const isValid = await verifyOtp(identifier, otp);
  if (!isValid) return res.status(400).json({ error: 'Invalid or expired OTP' });
  res.json({ message: 'OTP verified successfully' });
}

async function resendOtp(req, res) {
  const { identifier, method } = req.body;

  const lastSent = await getLastSentTime(identifier);
  if (lastSent) {
    const now = new Date();
    const diff = (now - lastSent) / 1000;
    if (diff < 60) {
      return res.status(429).json({ error: `Please wait ${60 - Math.floor(diff)} seconds before resending` });
    }
  }

  const otp = generateOtp();
  await createOtpEntry(identifier, otp);

  try {
    if (method === 'email') await sendEmailOtp(identifier, otp);
    else await sendSmsOtp(identifier, otp);
    res.json({ message: `OTP resent via ${method}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
}


  

module.exports = { sendOtp, validateOtp , resendOtp };
