import sequelize from "./db.js";
import "../model/user.js"; // 👈 import all your models here
import "../model/category.js";

export const autoSyncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // or force: true
    console.log("✅ Database synced successfully!");
  } catch (error) {
    console.error("❌ Database sync failed:", error.message);
    throw error;
  }
};
