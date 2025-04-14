import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PopularCategory = sequelize.define("PopularCategory", {
  category_name: DataTypes.STRING,
});

export default PopularCategory;
