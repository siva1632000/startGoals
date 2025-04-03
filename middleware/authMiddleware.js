import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
