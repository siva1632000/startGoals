// import { DataTypes, Model, Op } from 'sequelize';
// import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';
// import cron from 'node-cron';
// import sequelize from '../config/db.js'; // make sure path is correct

// // Define the OTP model (table: otptest)
// class Otp extends Model {}

// Otp.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//       defaultValue: DataTypes.UUIDV4,
//     },
//     identifier: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     otp: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     expires_at: {
//       type: DataTypes.DATE,
//       allowNull: false,
//     },
//     last_sent_at: {
//       type: DataTypes.DATE,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM('active', 'expired'),
//       defaultValue: 'active',
//     },
//   },
//   {
//     sequelize,
//     modelName: 'Otp',
//     tableName: 'otptest', // <-- Change table name here
//     timestamps: false,
//   }
// );

// // ============================
// // OTP Logic Functions
// // ============================

// // Create a new OTP entry
// export async function createOtpEntry(identifier, otp) {
//   const hashedOtp = await bcrypt.hash(otp, 10);

//   // Expire old OTPs for same identifier
//   await Otp.update(
//     { status: 'expired' },
//     {
//       where: {
//         identifier,
//         status: 'active',
//       },
//     }
//   );

//   await Otp.create({
//     id: uuidv4(),
//     identifier,
//     otp: hashedOtp,
//     expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
//     last_sent_at: new Date(),
//     status: 'active',
//   });
// }

// // Verify OTP
// export async function verifyOtp(identifier, inputOtp) {
//   const otpEntry = await Otp.findOne({
//     where: {
//       identifier,
//       status: 'active',
//     },
//     order: [['last_sent_at', 'DESC']],
//   });

//   if (!otpEntry) return false;

//   // Expired check
//   if (otpEntry.expires_at < new Date()) {
//     await otpEntry.update({ status: 'expired' });
//     return false;
//   }

//   const match = await bcrypt.compare(inputOtp, otpEntry.otp);
//   if (match) {
//     await otpEntry.update({ status: 'expired' });
//     return true;
//   }

//   return false;
// }

// // Get last OTP sent time
// export async function getLastSentTime(identifier) {
//   const otp = await Otp.findOne({
//     where: {
//       identifier,
//       status: 'active',
//     },
//     order: [['last_sent_at', 'DESC']],
//   });

//   return otp ? otp.last_sent_at : null;
// }

// // Get OTP history
// export async function getOtpHistory(identifier) {
//   return await Otp.findAll({
//     where: { identifier },
//     order: [['last_sent_at', 'DESC']],
//     attributes: ['id', 'last_sent_at', 'expires_at', 'status'],
//   });
// }

// // Expire old OTPs
// export async function expireOldOtps() {
//   try {
//     const result = await Otp.update(
//       { status: 'expired' },
//       {
//         where: {
//           status: 'active',
//           expires_at: { [Op.lt]: new Date() },
//         },
//       }
//     );
//     console.log(`[${new Date().toISOString()}] ✅ Expired ${result[0]} OTP(s)`);
//   } catch (err) {
//     console.error(`[${new Date().toISOString()}] ❌ Error expiring OTPs:`, err);
//   }
// }

// // ============================
// // Cron Job to Expire OTPs Every Minute
// // ============================

// cron.schedule('* * * * *', async () => {
//   await expireOldOtps();
// });

// // Sync the model (create table if it doesn't exist)
// sequelize.sync({ alter: true }).then(() => {
//   console.log('✅ otptest table synced');
// }).catch((err) => {
//   console.error('❌ Error syncing table:', err);
// });

// export default Otp;


import { DataTypes, Model, Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';
import sequelize from '../config/db.js';

// Define the OTP model (table: otptest)
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
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'otptest',
    timestamps: false,
  }
);

// Utility: Check if identifier is an email
function isEmail(identifier) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier);
}

// ============================
// OTP Logic Functions
// ============================

// Create a new OTP entry
export async function createOtpEntry(identifier, otp) {
  const hashedOtp = await bcrypt.hash(otp, 10);

  const email = isEmail(identifier) ? identifier : null;
  const mobile = !isEmail(identifier) ? identifier : null;

  // Expire old OTPs for this identifier
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
    email,
    mobile,
    otp: hashedOtp,
    expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
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
    },
    order: [['last_sent_at', 'DESC']],
  });

  if (!otpEntry) return false;

  if (otpEntry.expires_at < new Date()) {
    await otpEntry.update({ status: 'expired' });
    return false;
  }

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
    attributes: ['id', 'email', 'mobile', 'last_sent_at', 'expires_at', 'status'],
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

// Cron job to expire every minute
cron.schedule('* * * * *', async () => {
  await expireOldOtps();
});

// Sync the table
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ otptest table synced');
}).catch((err) => {
  console.error('❌ Error syncing table:', err);
});

export default Otp;
