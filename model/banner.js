import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { commonFields, commonOptions } from "../utils/baseModelConfig.js";

const Banner = sequelize.define(
  "Banner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING(10000),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ...commonFields, // ⬅️ adds createdAt, updatedAt, deletedAt
  },
  {
    tableName: "banners",
    ...commonOptions, // ⬅️ includes timestamps, paranoid, underscored
  }
);

export default Banner;
