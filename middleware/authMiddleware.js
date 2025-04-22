import jwt from "jsonwebtoken";
// import User from "../model/User.js"; 
import User from "../model/user.js";

export const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch full user from DB with isVerified and other fields
    const user = await User.findByPk(decoded.id); // assumes `id` is in token payload

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // Full Sequelize user instance available in all routes
    next();
  } catch (error) {
    console.error("JWT error:", error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
