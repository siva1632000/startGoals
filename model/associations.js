import User from "./user.js";
import Language from "./language.js";
import Skill from "./skill.js";

// Many-to-Many
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

User.belongsToMany(Skill, {
  through: "UserSkills",
  as: "skills",
  foreignKey: "userId",
});

Skill.belongsToMany(User, {
  through: "UserSkills",
  as: "users",
  foreignKey: "skillId",
});


export { User, Language };
