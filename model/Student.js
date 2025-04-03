import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Student = sequelize.define("Student", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM,
    values: ["M", "F", "O", "NA"],
    allowNull: false,
  },
  standard: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  school: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    enum: ["admin", "manager", "teacher", "student", "parent"],
    defaultValue: "student",
  },
});

export default Student;
