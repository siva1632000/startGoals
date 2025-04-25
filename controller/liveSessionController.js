// controllers/liveSessionController.js
import sequelize from "../config/db.js";
import LiveSession from "../model/liveSession.js";
import Batch from "../model/batch.js";
import Course from "../model/course.js";
import { generateToken } from "../config/agoraConfig.js";
import AgoraAccessToken from "agora-access-token";
import axios from "axios";
import { getZoomAccessToken } from "../config/zoomconfig.js";

const { RtcRole } = AgoraAccessToken;
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

export const liveSessionCreation = async (req, res) => {
  try {
    const { channelName, userId, expiryTime } = req.body;

    if (!channelName || !userId) {
      return res.status(400).json({ status: false, message: "Missing fields" });
    }
    // // role should be passed in body or query (publisher or subscriber)
    // const role =
    //   req.body.role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const data = generateToken(
      channelName,
      userId,
      RtcRole.PUBLISHER,
      expiryTime
    );
    return res.status(200).json({
      status: true,
      token: data.token,
      appId: data.appId,
      channelName,
    });
  } catch (err) {
    console.error("Agora token error:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const createZoomLive = async (req, res) => {
  try {
    const accessToken = await getZoomAccessToken();

    const meetingConfig = {
      topic: req.body.topic || "Live Class",
      type: 1, // Instant Meeting
      settings: {
        join_before_host: true,
        approval_type: 0,
        host_video: true,
        participant_video: true,
      },
    };

    const meetingResponse = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingConfig,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Meeting created successfully",
      data: meetingResponse.data,
    });
  } catch (error) {
    console.error("Error creating Zoom meeting:", error);
    res.status(500).json({
      message: "Failed to create Zoom meeting",
      error: error.message,
    });
  }
};
