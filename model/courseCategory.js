// models/category.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { commonFields, commonOptions } from "../utils/baseModelConfig.js";

const Category = sequelize.define(
  "courseCategory",
  {
    categoryId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    categoryCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 3],
        isUppercase: true,
      },
    },
    ...commonFields, // ✅ shared fields like createdAt, updatedAt, deletedAt
  },
  {
    tableName: "course_categories",
    ...commonOptions, // ✅ shared options: timestamps, paranoid, underscored
  }
);

export default Category;
