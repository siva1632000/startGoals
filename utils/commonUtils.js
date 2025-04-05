export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validateMobile(mobile) {
  const re = /^[6-9]\d{9}$/;
  return re.test(String(mobile));
}
