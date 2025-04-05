import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    enum: ["admin", "owner", "teacher", "student"],
    defaultValue: "student",
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      is: /^\+?[1-9]\d{1,14}$/, // E.164 international phone number format
    },
  },
});

export default User;
