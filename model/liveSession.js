import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { commonFields, commonOptions } from "../utils/baseModelConfig.js";

const LiveSession = sequelize.define(
  "liveSession",
  {
    sessionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    batchId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meetingLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sessionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'active', 'ended'),
      defaultValue: 'scheduled',
      allowNull: false,
    },
    platform: {
      type: DataTypes.ENUM('agora', 'zoom'),
      allowNull: false,
    },
    platformSessionId: { // Stores Agora channel name or Zoom meeting ID
      type: DataTypes.STRING,
      allowNull: true, // May not be available immediately upon creation for Zoom if using API to create then start
    },
    ...commonFields,
  },
  {
    tableName: "live_sessions",
    ...commonOptions,
  }
);

export default LiveSession;
