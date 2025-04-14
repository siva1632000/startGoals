import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Banner = sequelize.define("Banner", {
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
});

export default Banner;
