// controllers/liveSessionController.js
import sequelize from "../config/db.js";
import LiveSession from "../model/liveSession.js";
import Batch from "../model/batch.js";
import Course from "../model/course.js";

export const createLiveSession = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      courseId,
      batchId,
      title,
      meetingLink,
      sessionDate,
      startTime,
      endTime,
      durationMinutes,
    } = req.body;

    // ✅ Input validation
    if (
      !courseId ||
      !batchId ||
      !title ||
      !meetingLink ||
      !sessionDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
      });
    }

    // ✅ Validate course & batch existence
    // ✅ Validate course & batch existence without fetching full objects
    const course = await Course.count({
      where: { courseId },
      transaction: t,
    });
    const batch = await Batch.count({
      where: { batchId },
      transaction: t,
    });

    if (!course) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }

    if (!batch) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "Batch not found",
      });
    }

    // ✅ Optionally calculate duration if not sent
    let duration = durationMinutes;
    if (!durationMinutes) {
      const start = new Date(`1970-01-01T${startTime}Z`);
      const end = new Date(`1970-01-01T${endTime}Z`);
      duration = Math.floor((end - start) / 60000); // in minutes
    }

    // ✅ Create Live Session
    const session = await LiveSession.create(
      {
        courseId,
        batchId,
        title,
        meetingLink,
        sessionDate,
        startTime,
        endTime,
        durationMinutes: duration,
        createdBy: req.user?.id || null,
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json({
      status: true,
      message: "Live session created successfully",
      data: session,
    });
  } catch (error) {
    console.error("Live session creation error:", error);
    await t.rollback();
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
