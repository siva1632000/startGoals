import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  createCategory,
  getAllCategories,
  bulkCreateCategories,
  getCategoryById,
  getCategoryByCode,
  deleteCategoryById,
} from "../controller/categoryController.js";

const router = express.Router();

router.post("/saveCategory", createCategory); // Single insert
router.post("/saveAllCategories", bulkCreateCategories); // Bulk insert
router.get("/getCategories", getAllCategories); // All
router.get("/categoryById/:id", getCategoryById); // By ID
router.get("/categoryByCode/:code", getCategoryByCode); // By categoryCode
router.delete("/deleteCategory/:id", deleteCategoryById);

export default router;
