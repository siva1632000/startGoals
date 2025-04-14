// model/course.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Course = sequelize.define("Course", {
  course_code: DataTypes.STRING,
  course_title: DataTypes.STRING,
  course_sub_title: DataTypes.STRING,
  course_description: DataTypes.TEXT,
  course_price: DataTypes.INTEGER,
  image: DataTypes.STRING,
  language: DataTypes.STRING,
  category: DataTypes.STRING,
  reviews: DataTypes.INTEGER,
  rating: DataTypes.FLOAT,
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING), // ✅ Add this
    allowNull: true
  }
});

export default Course;


