// utils/baseModelConfig.js
import { DataTypes } from "sequelize";

// Shared fields like createdAt, updatedAt, deletedAt
export const commonFields = {
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
};

// Shared model options
export const commonOptions = {
  timestamps: true,
  paranoid: true, // enables soft delete via deletedAt
  underscored: true, // converts camelCase fields to snake_case columns
};
