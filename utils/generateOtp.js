export default function generateOtp() {
  return Math.floor(1000 + Math.random() * 900000).toString();
}
