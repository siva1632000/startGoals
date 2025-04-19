// Create a new course (hybrid, recorded, or live)
import sequelize from "../config/db.js";
import Course from "../model/course.js";
import { validateCourseInput } from "../utils/commonUtils.js";
import CourseLevel from "../model/courseLevel.js";
import CourseCategory from "../model/courseCategory.js";
import CourseTag from "../model/courseTag.js";
import Language from "../model/language.js";
import CourseGoal from "../model/courseGoal.js";
import CourseRequirement from "../model/courseRequirement.js";
import Section from "../model/section.js";
import Lesson from "../model/lesson.js";
import Resource from "../model/resource.js";
import User from "../model/user.js";
import { Op } from "sequelize";

export const getCourseById = async (req, res) => {
  const { courseId } = req.params;

  // Basic UUID validation
  if (
    !courseId ||
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
      courseId
    )
  ) {
    return res.status(400).json({
      status: false,
      message: "Invalid course ID format.",
    });
  }

  try {
    const course = await Course.findOne({
      where: { courseId },
      include: [
        {
          model: CourseLevel,
          as: "level",
          attributes: ["levelId", "level", "order"],
        },
        {
          model: CourseCategory,
          as: "category",
          attributes: ["categoryId", "categoryName"],
        },
        {
          model: User,
          as: "instructor",
          attributes: ["userId", "username", "email", "mobile", "profileImage"],
        },
        {
          model: CourseTag,
          as: "tags",
          attributes: ["tag"],
        },
        {
          model: Language,
          through: { attributes: [] },
          attributes: ["languageId", "language", "languageCode"],
          // course_languages join table
        },
        {
          model: CourseGoal,
          as: "goals",
          attributes: ["goalId", "goalText"],
        },
        {
          model: CourseRequirement,
          as: "requirements",
          attributes: ["requirementId", "requirementText", "order"],
        },
        {
          model: Section,
          as: "sections",
          include: [
            {
              model: Lesson,
              as: "lessons",
              include: [
                {
                  model: Resource,
                  as: "resources",
                  attributes: ["resourceId", "type", "fileUrl", "title"],
                },
              ],
              attributes: [
                "lessonId",
                "title",
                "videoUrl",
                "duration",
                "content",
                "type",
                "order",
              ],
            },
          ],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({
        status: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Course fetched successfully.",
      course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching the course.",
    });
  }
};

export const createCourse = async (req, res) => {
  const {
    title,
    description,
    levelId,
    categoryId,
    languageIds,
    tags,
    goals,
    requirements,
    createdBy,
    isPaid,
    price,
    type,
    wasLive,
    liveStartDate,
    liveEndDate,
    thumbnailUrl,
  } = req.body;

  // Validate course input
  const validationErrors = validateCourseInput(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      status: false,
      errors: validationErrors,
    });
  }

  const transaction = await sequelize.transaction();

  try {
    if (
      (type === "live" || type === "hybrid") &&
      (!liveStartDate || !liveEndDate)
    ) {
      return res.status(400).json({
        status: false,
        message:
          "Live and Hybrid courses must have both liveStartDate and liveEndDate.",
      });
    }

    // Step 1: Create course
    const newCourse = await Course.create(
      {
        title,
        description,
        levelId,
        categoryId,
        createdBy,
        isPaid,
        price,
        type,
        liveStartDate,
        liveEndDate,
        thumbnailUrl,
        wasLive,
      },
      { transaction }
    );

    // Step 2: Validate languageIds exist
    const languages = await Language.findAll({
      where: {
        languageId: { [Op.in]: languageIds },
      },
      transaction,
    });

    if (languages.length !== languageIds.length) {
      await transaction.rollback();
      return res.status(400).json({
        status: false,
        message: "Some language IDs are invalid",
      });
    }

    // Step 3: Associate languages
    await newCourse.setLanguages(languageIds, { transaction });

    // Step 4: Save tags
    if (tags?.length) {
      const tagRecords = tags.map((tag) => ({
        tag,
        courseId: newCourse.courseId,
      }));
      await CourseTag.bulkCreate(tagRecords, { transaction });
    }

    // Step 5: Save goals
    if (goals?.length) {
      const goalRecords = goals.map((goalText, index) => ({
        goalText,
        courseId: newCourse.courseId,
        order: index + 1,
      }));
      await CourseGoal.bulkCreate(goalRecords, { transaction });
    }

    // Step 6: Save requirements
    if (requirements?.length) {
      const requirementRecords = requirements.map((requirementText, index) => ({
        requirementText,
        courseId: newCourse.courseId,
        order: index + 1,
      }));
      await CourseRequirement.bulkCreate(requirementRecords, { transaction });
    }

    // Step 7: Commit
    await transaction.commit();

    return res.status(201).json({
      status: true,
      message: "Course created successfully!",
      course: newCourse,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating course:", error);
    return res.status(500).json({
      status: false,
      message: "Error creating course",
    });
  }
};

export const updateCourse = async (req, res) => {
  const {
    courseId, // required for identifying the course to update
    title,
    description,
    levelId,
    categoryId,
    languageIds,
    tags,
    goals,
    requirements,
    isPaid,
    price,
    type,
    wasLive,
    liveStartDate,
    liveEndDate,
    thumbnailUrl,
  } = req.body;

  // Validate input
  if (!courseId) {
    return res.status(400).json({
      status: false,
      message: "courseId is required to update course",
    });
  }

  const validationErrors = validateCourseInput({
    title,
    description,
    levelId,
    categoryId,
    isPaid,
    price,
    type,
    liveStartDate,
    liveEndDate,
  });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      status: false,
      errors: validationErrors,
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Find course
    const existingCourse = await Course.findByPk(courseId, { transaction });

    if (!existingCourse) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }

    // Validate live/hybrid course dates
    if (
      (type === "live" || type === "hybrid") &&
      (!liveStartDate || !liveEndDate)
    ) {
      return res.status(400).json({
        status: false,
        message:
          "Live and Hybrid courses must have both liveStartDate and liveEndDate.",
      });
    }

    // Step 1: Update course fields
    await existingCourse.update(
      {
        title,
        description,
        levelId,
        categoryId,
        isPaid,
        price,
        type,
        wasLive,
        liveStartDate,
        liveEndDate,
        thumbnailUrl,
      },
      { transaction }
    );

    // Step 2: Update languages
    if (languageIds?.length) {
      const languages = await Language.findAll({
        where: {
          languageId: { [Op.in]: languageIds },
        },
        transaction,
      });

      if (languages.length !== languageIds.length) {
        await transaction.rollback();
        return res.status(400).json({
          status: false,
          message: "Some language IDs are invalid",
        });
      }

      await existingCourse.setLanguages(languageIds, { transaction });
    }

    // Step 3: Update tags
    if (tags) {
      await CourseTag.destroy({ where: { courseId }, transaction });
      if (tags.length) {
        const tagRecords = tags.map((tag) => ({ tag, courseId }));
        await CourseTag.bulkCreate(tagRecords, { transaction });
      }
    }

    // Step 4: Update goals
    if (goals) {
      await CourseGoal.destroy({ where: { courseId }, transaction });
      if (goals.length) {
        const goalRecords = goals.map((goalText, index) => ({
          goalText,
          courseId,
          order: index + 1,
        }));
        await CourseGoal.bulkCreate(goalRecords, { transaction });
      }
    }

    // Step 5: Update requirements
    if (requirements) {
      await CourseRequirement.destroy({ where: { courseId }, transaction });
      if (requirements.length) {
        const requirementRecords = requirements.map(
          (requirementText, index) => ({
            requirementText,
            courseId,
            order: index + 1,
          })
        );
        await CourseRequirement.bulkCreate(requirementRecords, { transaction });
      }
    }

    await transaction.commit();

    return res.status(200).json({
      status: true,
      message: "Course updated successfully!",
      course: existingCourse,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating course:", error);
    return res.status(500).json({
      status: false,
      message: "Error updating course",
    });
  }
};
