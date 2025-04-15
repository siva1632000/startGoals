import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import BaseModel from "./baseModel.js";

class CourseTag extends BaseModel {}

CourseTag.init(
  {
    courseTagId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ...BaseModel.baseFields(),
  },
  {
    sequelize,
    modelName: "courseTag",
    tableName: "course_tags",
    ...BaseModel.baseOptions(),
  }
);

export default CourseTag;
