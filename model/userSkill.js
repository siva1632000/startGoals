import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "../model/user.js";
import Skill from "./skill.js";

const UserSkill = sequelize.define(
  "UserSkill",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skillId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "user_skills",
    timestamps: true,
  }
);

User.belongsToMany(Skill, { through: UserSkill, foreignKey: "userId" });
Skill.belongsToMany(User, { through: UserSkill, foreignKey: "skillId" });

export default UserSkill;
