import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/db.js";
import { commonFields, commonOptions } from "../utils/baseModelConfig.js";

const Skill = sequelize.define(
  "skill",
  {
    skillId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    skillName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Skill name is required" },
        len: {
          args: [2, 100],
          msg: "Skill name must be between 2 and 100 characters",
        },
      },
    },
    goalId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "goal_id",
      references: {
        model: "goals",
        key: "goalId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    ...commonFields,
  },
  {
    tableName: "skills",
    ...commonOptions,
  }
);

export default Skill;
