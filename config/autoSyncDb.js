//import sequelize from "./db.js";
import models, { sequelize } from "../model/assosiation.js";

export const autoSyncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // or force: true
    console.log("✅ Database synced successfully!");
  } catch (error) {
    console.error("❌ Database sync failed:", error.message);
    throw error;
  }
};
