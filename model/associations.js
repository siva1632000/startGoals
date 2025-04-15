import User from "../model/user.js";
import Skill from "./skill.js";
import Course from "../model/course.js";
import Category from "./category.js";
import UserSkill from "./userSkill.js";

// ========== Skill Associations ==========
User.belongsToMany(Skill, {
  through: UserSkill,
  as: "skills", // Correct alias
  foreignKey: "userId",
});

Skill.belongsToMany(User, {
  through: UserSkill,
  as: "skillUsers", // Optional alias
  foreignKey: "skillId",
});

// ========== Course-Skill Associations ==========
Course.belongsToMany(Skill, {
  through: "CourseSkills",
  foreignKey: "courseId",
  otherKey: "skillId",
  as: "courseSkills",
});

Skill.belongsToMany(Course, {
  through: "CourseSkills",
  foreignKey: "skillId",
  otherKey: "courseId",
  as: "skillCourses",
});

// ========== Course-User Associations ==========
User.belongsToMany(Course, {
  through: "UserCourses",
  foreignKey: "userId",
  as: "myCourses",
});

Course.belongsToMany(User, {
  through: "UserCourses",
  foreignKey: "courseId",
  as: "enrolledUsers",
});

export { User, Skill, Course, Category, UserSkill };
