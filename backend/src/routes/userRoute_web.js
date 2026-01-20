import { Router } from "express";
import {
  createUser,
  updateUser,
  deleteUser,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

// Admin only routes - User management
// POST /create-user - Create a new user (Admin only)
router.post(
  "/create-user",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  createUser,
);
// POST /update-user - Update user information (Admin only)
router.post(
  "/update-user",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  updateUser,
);
// DELETE /delete-user - Delete a user (Admin only)
router.delete(
  "/delete-user",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteUser,
);

export default router;
