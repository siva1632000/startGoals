import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Language = sequelize.define(
  "Language",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    language_code: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true,
    },
    language_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "languages",
    timestamps: false,
  }
);

export default Language;
