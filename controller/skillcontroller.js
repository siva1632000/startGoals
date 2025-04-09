import Skill from '../model/skill.js';
import { isValidSkill } from '../utils/commonUtils.js';

export const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!isValidSkill(skill)) {
      return res.status(400).json({ success: false, message: 'Invalid skill name' });
    }

    const existing = await Skill.findOne({ where: { skill } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Skill already exists' });
    }

    const newSkill = await Skill.create({ skill });
    res.status(201).json({
      success: true,
      data: newSkill,
      message: 'Skill added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll();

    if (!skills || skills.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No skills found',
      });
    }

    res.status(200).json({
      success: true,
      data: skills,
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
