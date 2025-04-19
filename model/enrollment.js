import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { commonFields, commonOptions } from "../utils/baseModelConfig.js";

const Enrollment = sequelize.define(
  "enrollment",
  {
    enrollmentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users", // Reference to User model
        key: "user_id", // Foreign key in User model
      },
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "courses", // Reference to Course model
        key: "course_id", // Foreign key in Course model
      },
    },
    enrolledAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    ...commonFields, // Include shared fields like createdAt, updatedAt, deletedAt
  },
  {
    tableName: "enrollments",
    ...commonOptions, // Include shared options like timestamps, paranoid, and underscored
  }
);

export default Enrollment;
