import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import BaseModel from "./baseModel.js";

class Course extends BaseModel {}

Course.init(
  {
    courseId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    levelId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
    },
    languageId: {
      type: DataTypes.UUID,
    },
    createdBy: {
      type: DataTypes.UUID,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type: {
      type: DataTypes.ENUM("recorded", "live", "hybrid"),
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    liveStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    liveEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    wasLive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    recordedFromId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ...BaseModel.baseFields(),
  },
  {
    sequelize,
    modelName: "course",
    tableName: "courses",
    ...BaseModel.baseOptions(),
  }
);

export default Course;
