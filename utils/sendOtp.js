import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

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

export async function sendEmailOtp(to, otp) {
  await transporter.sendMail({
    from: `"START GOALS" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `<p>Your OTP code is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
}

export async function sendSmsOtp(to, otp) {
  await client.messages.create({
    body: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    from: process.env.TWILIO_PHONE,
    to,
  });
}
