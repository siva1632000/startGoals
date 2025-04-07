import { Model, DataTypes } from "sequelize";

export default class BaseModel extends Model {
  static baseFields() {
    return {
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
  }

  static baseOptions() {
    return {
      paranoid: true, // enables soft delete (sets deletedAt)
      timestamps: true, // enables createdAt and updatedAt
    };
  }
}
