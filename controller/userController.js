import sequelize from "../config/db.js";
import User from "../model/user.js";
import Language from "../model/language.js";
import { generateToken } from "../utils/jwtToken.js";
import { validateEmail, validateMobile } from "../utils/commonUtils.js";
import bcrypt from "bcrypt";
import Skill from "../model/skill.js"

export const userRegistration = async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;

    if (!password || (!email && !mobile)) {
      return res.status(400).json({
        message: "Email or mobile number is required along with password",
        status: false,
      });
    }

    if (email && !validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        status: false,
      });
    }

    if (mobile && !validateMobile(mobile)) {
      return res.status(400).json({
        message: "Invalid mobile number format",
        status: false,
      });
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email: email || null,
      mobile: mobile || null,
      password: hashedPassword,
      isVerified: false,
    });

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

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified. Please verify before logging in.",
        status: false,
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful.",
      status: true,
      data: {
        userId: user.id,
        username: user.username,
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
};

export const addUserLanguages = async (req, res) => {
  try {
    const user = req.user;
    const { languageIds } = req.body;

    if (!Array.isArray(languageIds) || languageIds.length === 0) {
      return res.status(400).json({
        message: "languageIds must be a non-empty array",
        status: false,
      });
    }

    const languages = await Language.findAll({ where: { id: languageIds } });

    if (languages.length !== languageIds.length) {
      return res.status(404).json({
        message: "One or more languages not found",
        status: false,
      });
    }

    await user.setLanguages(languageIds);

    return res.status(200).json({
      status: true,
      message: "Languages updated successfully",
    });
  } catch (err) {
    console.error("Add languages error:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const getUserLanguages = async (req, res) => {
  try {
    const user = req.user;

    if (!user.isVerified) {
      return res.status(403).json({
        message: "User not verified",
        status: false,
      });
    }

    const userWithLanguages = await User.findByPk(user.id, {
      include: {
        model: Language,
        as: "languages", // alias must match the one used in association
        attributes: ["id", "language_code", "language_name"],
        through: { attributes: [] },
      },
    });

    return res.status(200).json({
      status: true,
      message: "User languages fetched successfully",
      data: userWithLanguages.languages,
    });
  } catch (err) {
    console.error("Get languages error:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
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

    // Get valid skill records
    const skills = await Skill.findAll({ where: { id: skillIds } });

    if (skills.length !== skillIds.length) {
      return res.status(404).json({
        message: "One or more skills not found",
        status: false,
      });
    }

    // Fetch current skill IDs of the user
    const existingSkills = await user.getSkills({ attributes: ["id"] });
    const existingSkillIds = existingSkills.map(skill => skill.id);

    // Filter out already existing skill IDs
    const newSkillIds = skillIds.filter(id => !existingSkillIds.includes(id));

    // Add only new skills
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

// ✅ Get user's skills (only if verified)
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