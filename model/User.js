import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import BaseModel from "./baseModel.js";

class User extends BaseModel {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["admin", "owner", "teacher", "student"]],
      },
      defaultValue: "student",
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        is: /^\+?[1-9]\d{1,14}$/, // E.164 format
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ...BaseModel.baseFields(), // add createdAt, updatedAt, deletedAt
  },
  {
    sequelize,
    modelName: "User",
    ...BaseModel.baseOptions(), // enable paranoid + timestamps
  }
);

export default User;
