import express from "express";
import {
  studentRegistration,
  studentLogin,
} from "../controller/studentController.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const studentRouter = express.Router();

studentRouter.post(
  "/studentRegistration",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  studentRegistration
);

studentRouter.post("/studentLogin", studentLogin);

export default studentRouter;
