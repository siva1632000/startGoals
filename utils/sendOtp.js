import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";
import Otp from "../model/otp.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

dotenv.config();

const OTP_EXPIRY_MINUTES = 5;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// export async function sendEmailOtp(to, otp) {
//   await transporter.sendMail({
//     from: `"START GOALS" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "Your OTP Code",
//     html: `<p>Your OTP code is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
//   });
// }

export async function sendEmailOtp(to, otp) {
  try {
    const mailOptions = {
      from: `"START GOALS" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify your email - OTP Code",
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px;">
          <p>Hello,</p>
          <p>Your OTP code is: <b>${otp}</b></p>
          <p>This code will expire in <b>5 minutes</b>.</p>
          <br/>
          <p>If you didn't request this, you can safely ignore it.</p>
          <br/>
          <p>Regards,</p>
          <p><strong>START GOALS Team</strong></p>
        </div>
      `,
      headers: {
        "X-Priority": "1 (Highest)",
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}

export async function sendSmsOtp(to, otp) {
  await client.messages.create({
    body: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    from: process.env.TWILIO_PHONE,
    to,
  });
}

//used in userRegistration to send otp after registeration

export async function sendOtp(identifier) {
  // Determine delivery method based on identifier format
  let deliveryMethod = "email";
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  if (!isEmail) deliveryMethod = "sms";

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  // Expire old OTPs
  await Otp.update(
    { status: "expired" },
    {
      where: {
        identifier,
        status: "active",
      },
    }
  );

  // 2️⃣ Soft delete expired or used OTPs
  await Otp.destroy({
    where: {
      identifier,
      status: {
        [Op.in]: ["expired", "used"],
      },
    },
  });

  await Otp.create({
    identifier,
    otp: hashedOtp,
    expiresAt,
    deliveryMethod,
  });

  if (deliveryMethod === "email") await sendEmailOtp(identifier, otp);
  else await sendSmsOtp(identifier, otp);
}
export function generateOtp() {
  return Math.floor(1000 + Math.random() * 900000).toString();
}

// Verify OTP
export async function verifyOtp(identifier, inputOtp) {
  try {
    const otpEntry = await Otp.findOne({
      where: {
        identifier,
        status: "active",
        expiresAt: { [Op.gt]: new Date() }, // Check it's still valid
      },
      order: [["createdAt", "DESC"]],
    });

    // 🔴 If no OTP found or it's already expired
    if (!otpEntry) {
      return false;
    }

    // ✅ Match OTP
    const isMatch = await bcrypt.compare(inputOtp, otpEntry.otp);
    if (!isMatch) {
      return false;
    }

    // 🟢 Valid OTP - mark it as "used"
    await otpEntry.update({ status: "used" });

    return true;
  } catch (err) {
    throw new Error("Server error during OTP verification");
  }
}

export async function getLastSentTime(identifier) {
  const otp = await Otp.findOne({
    where: {
      identifier,
      status: "active",
    },
    order: [["createdAt", "DESC"]],
  });

  return otp ? otp.createdAt : null;
}
