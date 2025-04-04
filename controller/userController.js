import sequelize from "../config/db.js";
import User from "../model/user.js";
import { generateToken } from "../utils/jwtToken.js";
import { validateEmail, validateMobile } from "../utils/commonUtils.js"; // Assuming you have these utilities
import bcrypt from "bcrypt";

export const userRegistration = async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;

    // Step 1: Basic validation
    if (!password || (!email && !mobile)) {
      return res.status(400).json({
        message: "Email or mobile number is required along with password",
        status: false,
      });
    }

    // Step 2: Validate email format
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        status: false,
      });
    }

    // Step 3: Validate mobile format
    if (mobile && !validateMobile(mobile)) {
      return res.status(400).json({
        message: "Invalid mobile number format",
        status: false,
      });
    }

    // Step 4: Check for existing user (by email or mobile)
    const existingUser = await User.findOne({
      where: {
        ...(email && { email }),
        ...(mobile && { mobile }),
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email or mobile",
        status: false,
      });
    }

    // Step 5: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 6: Create user with isVerified: false by default
    const newUser = await User.create({
      username,
      email: email || null,
      mobile: mobile || null,
      password: hashedPassword,
      isVerified: false,
    });

    // Response
    return res.status(201).json({
      message: "User registered successfully",
      status: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
      status: false,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email or mobile and password are required.",
        status: false,
      });
    }

    let user;

    // Determine if identifier is email or mobile
    if (validateEmail(identifier)) {
      user = await User.findOne({ where: { email: identifier } });
    } else if (validateMobile(identifier)) {
      user = await User.findOne({ where: { mobile: identifier } });
    } else {
      return res.status(400).json({
        message: "Invalid email or mobile number format.",
        status: false,
      });
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials.",
        status: false,
      });
    }

    // ✅ Check if the user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified. Please verify before logging in.",
        status: false,
      });
    }

    // ✅ Check password match
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials.",
        status: false,
      });
    }

    // ✅ Generate and send token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful.",
      status: true,
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

export const googleLogin = async (req, res) => {
  res.send(
    '<h1>Home</h1><a href="http://localhost:8080/api/googleLogin">Login with Google</a>'
  );
};

export const googleCallback = async (req, res) => {
  if (!req.user) res.redirect("/auth/callback/failure");
  const userData = {
    name: JSON.parse(req.user._raw).name,
    email: JSON.parse(req.user._raw).email,
    profile: JSON.parse(req.user._raw).picture,
  };
  console.log(userData);
  res.send(userData);
  // res.redirect("/");
};
