// models/userLanguage.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserLanguage = sequelize.define("UserLanguage", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  languageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: "user_languages",
  timestamps: false,
});

export default UserLanguage;
