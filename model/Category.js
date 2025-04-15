import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import BaseModel from "./baseModel.js";

class Category extends BaseModel {}

Category.init(
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
    ...BaseModel.baseFields(), // ⬅️ Include base fields like createdAt, updatedAt, deletedAt
  },
  {
    sequelize,
    modelName: "category",
    tableName: "categories",
    ...BaseModel.baseOptions(), // ⬅️ Include base options like paranoid & timestamps
  }
);

export default Category;
