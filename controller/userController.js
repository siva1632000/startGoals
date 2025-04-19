import User from "../model/user.js";
import Skill from "../model/skill.js";
import Language from "../model/language.js";
import Goal from "../model/goal.js";
import { generateToken } from "../utils/jwtToken.js";
import sequelize from "../config/db.js";
import {
  validateEmail,
  validateMobile,
  generateOtp,
} from "../utils/commonUtils.js";
import bcrypt from "bcrypt";

// ✅ OTP-related imports
import { sendOtp } from "../utils/sendOtp.js";

export const userRegistration = async (req, res) => {
  const trans = await sequelize.transaction();

  try {
    const { username, email, mobile, password } = req.body;

    if (!password || (!email && !mobile)) {
      return res.status(400).json({
        message: "Email or mobile number is required along with password",
        status: false,
      });
    }

    if (email && !validateEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", status: false });
    }

    if (mobile && !validateMobile(mobile)) {
      return res
        .status(400)
        .json({ message: "Invalid mobile number format", status: false });
    }

    const existingUser = await User.findOne({
      where: {
        ...(email && { email }),
        ...(mobile && { mobile }),
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      {
        username,
        email: email || null,
        mobile: mobile || null,
        password: hashedPassword,
        isVerified: false,
      },
      { transaction: trans }
    );

    const identifier = email || mobile;

    // Send OTP (if it fails, we roll back the user)
    console.log("before::::::::::::::::::::");
    await sendOtp(identifier);

    await trans.commit();

    return res.status(201).json({
      message: `OTP sent to ${identifier}`,
      status: true,
    });
  } catch (error) {
    await trans.rollback();
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
        userId: user.userId,
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

    if (!user?.isVerified) {
      return res.status(403).json({
        message: "User not verified",
        status: false,
      });
    }

    // Reload user with associated skills (eager loading)
    const userWithSkills = await User.findOne({
      where: { id: user.id },
      include: [
        {
          model: Skill,
          as: "skills", // 👈 Must match association alias
          attributes: ["id", "skill"],
          through: { attributes: [] }, // hide junction table
        },
      ],
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

//user details by userId , languages ,goals ,skill will also come
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, // Optional: Hide sensitive data
      include: [
        {
          model: Language,
          as: "languages", // 👈 Use alias if defined in association
          through: { attributes: [] }, // Exclude join table fields
        },
        {
          model: Goal,
          as: "goal", // 👈 Use alias if defined
        },
        {
          model: Skill,
          as: "skills", // 👈 Use alias if defined
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching user details",
      error: error.message,
    });
  }
};
