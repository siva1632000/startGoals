// models/CourseLanguage.js

import { DataTypes } from "sequelize";
import BaseModel from "./baseModel.js";
import sequelize from "../config/db.js";

class CourseLanguage extends BaseModel {}

CourseLanguage.init(
  {
    languageId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ...BaseModel.baseFields(),
  },
  {
    sequelize,
    modelName: "courseLanguage",
    tableName: "course_language",
    ...BaseModel.baseOptions(),
  }
);

export default CourseLanguage;
