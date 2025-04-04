const db = require('../db');
const bcrypt = require('bcrypt');

async function createOtpEntry(identifier, otp) {
  const hashedOtp = await bcrypt.hash(otp, 10);
  await db.query(`
    INSERT INTO otps (identifier, otp, expires_at, last_sent_at)
    VALUES ($1, $2, NOW() + INTERVAL '5 minutes', NOW())
    ON CONFLICT (identifier)
    DO UPDATE SET otp = $2, expires_at = NOW() + INTERVAL '5 minutes', last_sent_at = NOW()
  `, [identifier, hashedOtp]);
}

async function verifyOtp(identifier, inputOtp) {
  const res = await db.query(`
    SELECT otp FROM otps WHERE identifier = $1 AND expires_at > NOW()
  `, [identifier]);
  if (res.rows.length === 0) return false;
  return await bcrypt.compare(inputOtp, res.rows[0].otp);
}

async function getLastSentTime(identifier) {
  const res = await db.query(`SELECT last_sent_at FROM otps WHERE identifier = $1`, [identifier]);
  return res.rows.length ? res.rows[0].last_sent_at : null;
}

module.exports = {
  createOtpEntry,
  verifyOtp,
  getLastSentTime
};
