import sequelize from "../config/db.js";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtToken.js";
import { validateEmail, validateMobile } from "../utils/commonUtils.js"; // Assuming you have these utilities

export const userRegistration = async (req, res) => {
  try {
    const user = req.body;
    console.log(user);

    const { username, email, mobile, password } = user;

    if (!password || (!email && !mobile)) {
      return res.status(200).json({
        message: "Email or mobile number is required along with password",
        status: false,
      });
    }

    // Validate email if provided
    if (email && !validateEmail(email)) {
      return res.status(200).json({
        message: "Invalid email format",
        status: false,
      });
    }

    // Validate mobile if provided
    if (mobile && !validateMobile(mobile)) {
      return res.status(200).json({
        message: "Invalid mobile number format",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      username,
      email: email || null,
      mobile: mobile || null,
      password: hashedPassword,
    };

    const savedUser = await User.create(userData);

    const { id } = savedUser;
    res.status(200).json({
      message: "User registered successfully",
      status: true,
      data: {
        id,
        username,
        email,
        mobile,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message, status: false });
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid credentials.",
        status: false,
      });
    }

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
