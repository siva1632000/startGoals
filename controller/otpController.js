// controller/otpController.js

import generateOtp from '../utils/generateOtp.js';
import {
  createOtpEntry,
  verifyOtp,
  getLastSentTime,
  getOtpHistory
} from '../model/otpModel.js';

import { sendEmailOtp, sendSmsOtp } from '../utils/sendOtp.js';
import User from '../model/user.js';
import { Op } from 'sequelize';

// Send OTP
export async function sendOtp(req, res) {
  const { identifier, method } = req.body;

  try {
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

    if (method === 'email') await sendEmailOtp(identifier, otp);
    else await sendSmsOtp(identifier, otp);

    res.json({ message: `OTP sent via ${method}` });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}

// Validate OTP and verify user
export async function validateOtp(req, res) {
  try {
    const { identifier, otp } = req.body;

    const isValid = await verifyOtp(identifier, otp);
    if (!isValid) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { mobile: identifier }]
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isVerified) {
      return res.json({ message: 'Account already verified' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'OTP verified successfully. Account is now verified.' });
  } catch (err) {
    console.error('Error validating OTP:', err);
    res.status(500).json({ error: 'Internal server error during OTP verification' });
  }
}

// Resend OTP
export async function resendOtp(req, res) {
  const { identifier, method } = req.body;

  try {
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

    if (method === 'email') await sendEmailOtp(identifier, otp);
    else await sendSmsOtp(identifier, otp);

    res.json({ message: `OTP resent via ${method}` });
  } catch (err) {
    console.error('Error resending OTP:', err);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
}

// Optional: Fetch OTP history
export async function fetchOtpHistory(req, res) {
  const { identifier } = req.query;

  if (!identifier) {
    return res.status(400).json({ error: 'Identifier is required' });
  }

  try {
    const history = await getOtpHistory(identifier);
    res.json({ history });
  } catch (err) {
    console.error('Error fetching OTP history:', err);
    res.status(500).json({ error: 'Failed to fetch OTP history' });
  }
}
