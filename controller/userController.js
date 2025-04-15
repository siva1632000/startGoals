import User from "../model/user.js";
import Skill from "../model/skill.js";
import { generateToken } from "../utils/jwtToken.js";
import { validateEmail, validateMobile } from "../utils/commonUtils.js";
import bcrypt from "bcrypt";

// ✅ OTP-related imports
import { sendEmailOtp, sendSmsOtp } from "../utils/sendOtp.js";
import generateOtp from "../utils/generateOtp.js";
import { createOtpEntry  } from "../model/otpModel.js";

// ✅ User Registration
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
    const newUser = await User.create({
      username,
      email: email || null,
      mobile: mobile || null,
      password: hashedPassword,
      isVerified: false,
      isVerified: false,
    });

    // ✅ Send OTP
    const identifier = email || mobile;
    const method = email ? "email" : "sms";
    const otp = generateOtp();
    await createOtpEntry(identifier, otp);
    if (email) await sendEmailOtp(identifier, otp);
    else await sendSmsOtp(identifier, otp);

    return res.status(201).json({
      message: `OTP sent to ${email}.`,
      success: true,
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

// ✅ User Login
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

    // Track first login status
    const isFirstLogin = user.firstLogin;

    if (isFirstLogin) {
      await user.update({ firstLogin: false }); // Mark as logged in
    }

    return res.status(200).json({
      message: "Login successful.",
      success: true,
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        token,
        isVerified: user.isVerified,
        firstTimeLogin: isFirstLogin,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// ✅ Google OAuth Placeholder
export const googleLogin = async (req, res) => {
  res.send('<h1>Home</h1><a href="/api/googleLogin">Login with Google</a>');
};

export const googleCallback = async (req, res) => {
  if (!req.user) return res.redirect("/auth/callback/failure");

  const userData = {
    name: JSON.parse(req.user._raw).name,
    email: JSON.parse(req.user._raw).email,
    profile: JSON.parse(req.user._raw).picture,
  };

  console.log(userData);
  res.send(userData);
};

// ✅ Add User Skills
export const addUserSkills = async (req, res) => {
  try {
    const user = req.user;
    const { skillIds } = req.body;

    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      return res.status(400).json({
        message: "skillIds must be a non-empty array",
        status: false,
      });
    }

    const skills = await Skill.findAll({ where: { id: skillIds } });

    if (skills.length !== skillIds.length) {
      return res.status(404).json({
        message: "One or more skills not found",
        status: false,
      });
    }

    const existingSkills = await user.getSkills({ attributes: ["id"] });
    const existingSkillIds = existingSkills.map((s) => s.id);
    const newSkillIds = skillIds.filter((id) => !existingSkillIds.includes(id));

    if (newSkillIds.length > 0) {
      await user.addSkills(newSkillIds);
    }

    return res.status(200).json({
      status: true,
      message: "Skills updated successfully",
    });
  } catch (err) {
    console.error("Add skills error:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// ✅ Get User Skills
export const getUserSkills = async (req, res) => {
  try {
    const user = req.user;

    if (!user.isVerified) {
      return res.status(403).json({
        message: "User not verified",
        status: false,
      });
    }

    const userWithSkills = await user.reload({
      include: {
        model: Skill,
        as: "skills",
        attributes: ["id", "skill"],
        through: { attributes: [] },
      },
    });

    return res.status(200).json({
      status: true,
      message: "User skills fetched successfully",
      data: userWithSkills.skills,
    });
  } catch (err) {
    console.error("Get skills error:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
