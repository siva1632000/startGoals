// models/lesson.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { commonFields, commonOptions } from "../utils/baseModelConfig.js";

const Lesson = sequelize.define(
  "lesson",
  {
    lessonId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "sections",
        key: "section_id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("video", "article", "quiz"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true, // in seconds
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isPreview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ...commonFields,
  },
  {
    tableName: "lessons",
    ...commonOptions,
  }
);

export default Lesson;
