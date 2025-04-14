import { User, Course, Skill } from "../model/associations.js";

export const addCourse = async (req, res) => {
  try {
    const {
      course_code,
      course_title,
      course_sub_title,
      course_description,
      course_price,
      image,
      language,
      category,
      reviews,
      rating,
      skills // <- Accept skills from the request body
    } = req.body;

    const course = await Course.create({
      course_code,
      course_title,
      course_sub_title,
      course_description,
      course_price,
      image,
      language,
      category,
      reviews,
      rating,
      skills // <- Save it to the DB
    });

    res.status(201).json({ success: true, message: "Course added", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
