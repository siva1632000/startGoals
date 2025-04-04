import db from '../db.js';
import bcrypt from 'bcrypt';

export async function createOtpEntry(identifier, otp) {
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Expire previous OTPs
  await db.query(`
    UPDATE otps
    SET status = 'expired'
    WHERE identifier = $1 AND status = 'active'
  `, [identifier]);

  // Insert new OTP
  await db.query(`
    INSERT INTO otps (identifier, otp, expires_at, last_sent_at, status)
    VALUES ($1, $2, NOW() + INTERVAL '5 minutes', NOW(), 'active')
  `, [identifier, hashedOtp]);
}

export async function verifyOtp(identifier, inputOtp) {
  const res = await db.query(`
    SELECT id, otp
    FROM otps
    WHERE identifier = $1 AND status = 'active' AND expires_at > NOW()
    ORDER BY last_sent_at DESC
    LIMIT 1
  `, [identifier]);

  if (res.rows.length === 0) return false;

  const match = await bcrypt.compare(inputOtp, res.rows[0].otp);
  if (match) {
    await db.query(`UPDATE otps SET status = 'expired' WHERE id = $1`, [res.rows[0].id]);
    return true;
  }

  return false;
}

export async function getLastSentTime(identifier) {
  const res = await db.query(`
    SELECT last_sent_at
    FROM otps
    WHERE identifier = $1 AND status = 'active'
    ORDER BY last_sent_at DESC
    LIMIT 1
  `, [identifier]);

  return res.rows.length ? res.rows[0].last_sent_at : null;
}

export async function getOtpHistory(identifier) {
  const res = await db.query(`
    SELECT id, last_sent_at, expires_at, status
    FROM otps
    WHERE identifier = $1
    ORDER BY last_sent_at DESC
  `, [identifier]);

  return res.rows;
}
