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
    ...commonFields,
  },
  {
    tableName: "live_sessions",
    ...commonOptions,
  }
);

export default LiveSession;
