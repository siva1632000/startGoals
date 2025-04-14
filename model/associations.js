import User from "../model/User.js";
import Language from "./language.js";
import Skill from "./skill.js";
import Course from "../model/course.js";
import Category from "./category.js";
import UserSkill from "./userSkill.js";

// ========== Language Associations ==========
User.belongsToMany(Language, {
  through: "user_languages",
  foreignKey: "userId",
  otherKey: "languageId",
  as: "languages",
});

Language.belongsToMany(User, {
  through: "user_languages",
  foreignKey: "languageId",
  otherKey: "userId",
  as: "users",
});

// ========== Skill Associations ==========
User.belongsToMany(Skill, {
  through: UserSkill,
  as: "skills",
  foreignKey: "userId",
});

Skill.belongsToMany(User, {
  through: UserSkill,
  as: "users",
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

export {
  User,
  Skill,
  Language,
  Course,
  Category,
  UserSkill
};
