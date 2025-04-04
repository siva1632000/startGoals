// import db from '../db.js';
// import bcrypt from 'bcrypt';

// // =======================
// // OTP CRUD Functions
// // =======================

// export async function createOtpEntry(identifier, otp) {
//   const hashedOtp = await bcrypt.hash(otp, 10);

//   // Expire previous OTPs
//   await db.query(`
//     UPDATE otps
//     SET status = 'expired'
//     WHERE identifier = $1 AND status = 'active'
//   `, [identifier]);

//   // Insert new OTP
//   await db.query(`
//     INSERT INTO otps (identifier, otp, expires_at, last_sent_at, status)
//     VALUES ($1, $2, NOW() + INTERVAL '5 minutes', NOW(), 'active')
//   `, [identifier, hashedOtp]);
// }

// export async function verifyOtp(identifier, inputOtp) {
//   const res = await db.query(`
//     SELECT id, otp
//     FROM otps
//     WHERE identifier = $1 AND status = 'active' AND expires_at > NOW()
//     ORDER BY last_sent_at DESC
//     LIMIT 1
//   `, [identifier]);

//   if (res.rows.length === 0) return false;

//   const match = await bcrypt.compare(inputOtp, res.rows[0].otp);
//   if (match) {
//     await db.query(`UPDATE otps SET status = 'expired' WHERE id = $1`, [res.rows[0].id]);
//     return true;
//   }

//   return false;
// }

// export async function getLastSentTime(identifier) {
//   const res = await db.query(`
//     SELECT last_sent_at
//     FROM otps
//     WHERE identifier = $1 AND status = 'active'
//     ORDER BY last_sent_at DESC
//     LIMIT 1
//   `, [identifier]);

//   return res.rows.length ? res.rows[0].last_sent_at : null;
// }

// export async function getOtpHistory(identifier) {
//   const res = await db.query(`
//     SELECT id, last_sent_at, expires_at, status
//     FROM otps
//     WHERE identifier = $1
//     ORDER BY last_sent_at DESC
//   `, [identifier]);

//   return res.rows;
// }

// // =======================
// // Auto Expiry Job
// // =======================

// export async function expireOldOtps() {
//   try {
//     const result = await db.query(`
//       UPDATE otps
//       SET status = 'expired'
//       WHERE status = 'active' AND expires_at < NOW()
//     `);
//     console.log(`[${new Date().toISOString()}] ✅ Expired ${result.rowCount} OTP(s)`);
//   } catch (err) {
//     console.error(`[${new Date().toISOString()}] ❌ Error expiring OTPs:`, err);
//   }
// }

// // Start the cron-like job every 5 minutes
// setInterval(expireOldOtps, 5 * 60 * 1000); // 5 mins in milliseconds
// expireOldOtps(); // run immediately once at startup


import db from '../db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// =======================
// OTP CRUD Functions
// =======================

export async function createOtpEntry(identifier, otp) {
  const hashedOtp = await bcrypt.hash(otp, 10);
  const uuid = uuidv4(); // Generate UUID

  // Expire previous OTPs
  await db.query(`
    UPDATE otps
    SET status = 'expired'
    WHERE identifier = $1 AND status = 'active'
  `, [identifier]);

  // Insert new OTP
  await db.query(`
    INSERT INTO otps (id, identifier, otp, expires_at, last_sent_at, status)
    VALUES ($1, $2, $3, NOW() + INTERVAL '5 minutes', NOW(), 'active')
  `, [uuid, identifier, hashedOtp]);
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

// =======================
// Auto Expiry Job
// =======================

export async function expireOldOtps() {
  try {
    const result = await db.query(`
      UPDATE otps
      SET status = 'expired'
      WHERE status = 'active' AND expires_at < NOW()
    `);
    console.log(`[${new Date().toISOString()}] ✅ Expired ${result.rowCount} OTP(s)`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Error expiring OTPs:`, err);
  }
}

// Run immediately and then every 5 minutes
expireOldOtps();
setInterval(expireOldOtps, 5 * 60 * 1000);
