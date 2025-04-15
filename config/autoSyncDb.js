import sequelize from "./db.js";
import User from "../model/user.js";

export const autoSyncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // or force: true
    console.log("✅ Database synced successfully!");
  } catch (error) {
    console.error("❌ Database sync failed:", error.message);
    throw error;
  }
};
