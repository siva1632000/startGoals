// controllers/sectionController.js
import Section from "../model/section.js";
import Lesson from "../model/lesson.js";
import sequelize from "../config/db.js";
import Resource from "../model/resource.js";
import Course from "../model/course.js";

//create section
export const createSection = async (req, res) => {
  const { courseId, title, description, order, lessons } = req.body;

  // Basic validation
  if (!courseId || !title || !Array.isArray(lessons)) {
    return res.status(400).json({
      status: false,
      message:
        "Missing required fields: courseId, title, or lessons must be provided",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Check course existence
    const course = await Course.findByPk(courseId);
    if (!course) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }

    // Create Section
    const section = await Section.create(
      {
        courseId,
        title,
        description,
        order,
      },
      { transaction }
    );

    // Create Lessons with Resources
    for (const lesson of lessons) {
      const {
        title,
        type,
        content,
        videoUrl,
        duration,
        order,
        isPreview,
        resources,
      } = lesson;

      // Lesson validation
      if (!title || !type || !["video", "article", "quiz"].includes(type)) {
        await transaction.rollback();
        return res.status(400).json({
          status: false,
          message:
            "Each lesson must have a valid title and type (video, article, quiz)",
        });
      }

      const newLesson = await Lesson.create(
        {
          sectionId: section.sectionId,
          title,
          type,
          content,
          videoUrl,
          duration,
          order,
          isPreview,
        },
        { transaction }
      );

      // Create resources if provided
      if (resources?.length) {
        for (const resource of resources) {
          const { title, fileUrl, type } = resource;
          if (
            !title ||
            !fileUrl ||
            !["pdf", "doc", "zip", "ppt", "xls", "csv", "jpg", "png"].includes(
              type
            )
          ) {
            await transaction.rollback();
            return res.status(400).json({
              status: false,
              message:
                "Each resource must have a valid title, fileUrl, and allowed type",
            });
          }

          await Resource.create(
            {
              lessonId: newLesson.lessonId,
              title,
              fileUrl,
              type,
            },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();

    return res.status(201).json({
      status: true,
      message: "Section, lessons, and resources created successfully",
      sectionId: section.sectionId,
    });
  } catch (error) {
    console.error("Error creating section with lessons/resources:", error);
    await transaction.rollback();
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//update section by sectionId
export const updateSectionById = async (req, res) => {
  const { sectionId } = req.params;
  const { title, description, order } = req.body;

  // Validation
  if (!sectionId) {
    return res.status(400).json({
      status: false,
      message: "Section ID is required in the URL.",
    });
  }

  if (title !== undefined && typeof title !== "string") {
    return res.status(400).json({
      status: false,
      message: "Title must be a string.",
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      status: false,
      message: "Description must be a string.",
    });
  }

  if (order !== undefined && (typeof order !== "number" || order < 0)) {
    return res.status(400).json({
      status: false,
      message: "Order must be a non-negative number.",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const section = await Section.findByPk(sectionId, { transaction });

    if (!section) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        message: "Section not found",
      });
    }

    section.title = title !== undefined ? title : section.title;
    section.description =
      description !== undefined ? description : section.description;
    section.order = order !== undefined ? order : section.order;

    await section.save({ transaction });
    await transaction.commit();

    return res.status(200).json({
      status: true,
      message: "Section updated successfully!",
      section,
    });
  } catch (error) {
    console.error("Error updating section:", error);
    await transaction.rollback();
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//get all sections by its courseId
export const getSectionsByCourseId = async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json({
      status: false,
      message: "courseId parameter is required",
    });
  }

  try {
    // Ensure course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }

    const sections = await Section.findAll({
      where: { courseId },
      include: [
        {
          model: Lesson,
          as: "lessons",
          include: [
            {
              model: Resource,
              as: "resources",
              attributes: ["resourceId", "title", "fileUrl", "type", "order"],
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    });

    // Manual sorting of sections, lessons, and resources
    sections.sort((a, b) => a.order - b.order);
    sections.forEach((section) => {
      section.lessons.sort((a, b) => a.order - b.order);
      section.lessons.forEach((lesson) => {
        if (lesson.resources) {
          lesson.resources.sort((a, b) => a.order - b.order);
        }
      });
    });

    return res.status(200).json({
      status: true,
      message: "Sections fetched successfully",
      sections,
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//get  section by its sectionId
export const getSectionById = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const section = await Section.findOne({
      where: { sectionId },
      include: [
        {
          model: Lesson,
          as: "lessons",
          include: [
            {
              model: Resource,
              as: "resources",
              order: [["order", "ASC"]], // ordering resources within a lesson
            },
          ],
          order: [["order", "ASC"]], // ordering lessons within section
        },
      ],
    });

    if (!section) {
      return res.status(404).json({
        status: false,
        message: "Section not found",
      });
    }

    // Force nested sorting if Sequelize didn't fully sort nested arrays
    section.lessons.sort((a, b) => a.order - b.order);
    section.lessons.forEach((lesson) => {
      if (lesson.resources) {
        lesson.resources.sort((a, b) => a.order - b.order);
      }
    });

    return res.status(200).json({
      status: true,
      section,
    });
  } catch (error) {
    console.error("Error fetching section by ID:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
