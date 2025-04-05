import { DataTypes, Model, Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../db.js'; // use your existing db connection

// Define the OTP model
class Otp extends Model {}

Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'expired'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'Otp',
    tableName: 'otps',
    timestamps: false,
  }
);

// ============================
// OTP Logic Functions
// ============================

// Create a new OTP entry
export async function createOtpEntry(identifier, otp) {
  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.update(
    { status: 'expired' },
    {
      where: {
        identifier,
        status: 'active',
      },
    }
  );

  await Otp.create({
    id: uuidv4(),
    identifier,
    otp: hashedOtp,
    expires_at: new Date(Date.now() + 5 * 60 * 1000),
    last_sent_at: new Date(),
    status: 'active',
  });
}

// Verify OTP
export async function verifyOtp(identifier, inputOtp) {
  const otpEntry = await Otp.findOne({
    where: {
      identifier,
      status: 'active',
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
    order: [['last_sent_at', 'DESC']],
  });

  if (!otpEntry) return false;

  const match = await bcrypt.compare(inputOtp, otpEntry.otp);
  if (match) {
    await otpEntry.update({ status: 'expired' });
    return true;
  }

  return false;
}

// Get last OTP sent time
export async function getLastSentTime(identifier) {
  const otp = await Otp.findOne({
    where: {
      identifier,
      status: 'active',
    },
    order: [['last_sent_at', 'DESC']],
  });

  return otp ? otp.last_sent_at : null;
}

// Get OTP history
export async function getOtpHistory(identifier) {
  return await Otp.findAll({
    where: { identifier },
    order: [['last_sent_at', 'DESC']],
    attributes: ['id', 'last_sent_at', 'expires_at', 'status'],
  });
}

// Expire old OTPs
export async function expireOldOtps() {
  try {
    const result = await Otp.update(
      { status: 'expired' },
      {
        where: {
          status: 'active',
          expires_at: { [Op.lt]: new Date() },
        },
      }
    );
    console.log(`[${new Date().toISOString()}] ✅ Expired ${result[0]} OTP(s)`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Error expiring OTPs:`, err);
  }
}

// Optional: run expiration job every 5 mins
expireOldOtps();
setInterval(expireOldOtps, 5 * 60 * 1000);

export default Otp;
