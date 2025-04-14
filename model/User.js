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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
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
    firstLogin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ...BaseModel.baseFields(), // createdAt, updatedAt, deletedAt if included
  },
  {
    sequelize,
    modelName: "user",
    tableName: "user",
    ...BaseModel.baseOptions(),
  }
);

export default User;
