export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validateMobile(mobile) {
  const re = /^[6-9]\d{9}$/;
  return re.test(String(mobile));
}

export const isValidSkill = (skill) => {
  return typeof skill === "string" && skill.trim().length > 0;
};
