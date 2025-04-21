// controllers/batchController.js
import Batch from "../model/batch.js";
import Course from "../model/course.js";
import sequelize from "../config/db.js";

export const createBatch = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { courseId, title, startTime, endTime, userId } = req.body;

    if (!courseId || !title || !startTime || !endTime || !userId) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
      });
    }

    const courseExists = await Course.count({
      where: { courseId },
      transaction: t,
    });
    if (!courseExists) {
      await t.rollback();
      return res
        .status(404)
        .json({ status: false, message: "Course not found" });
    }

    const batch = await Batch.create(
      {
        courseId,
        title,
        startTime,
        endTime,
        createdBy: userId || null,
      },
      { transaction: t }
    );

    await t.commit();
    return res
      .status(201)
      .json({ status: true, message: "Batch created", data: batch });
  } catch (err) {
    await t.rollback();
    console.error("Batch creation error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
