import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadIcon,
  getPoints,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

// All authenticated users (admin and user) - User profile management
// GET /profile - Get current user profile
router.get(
  "/profile",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  getProfile,
);
// PUT /profile - Update current user profile
router.put(
  "/profile",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  updateProfile,
);
// POST /upload-icon - Upload user profile icon
router.post(
  "/upload-icon",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  uploadIcon,
);
// GET /points - Get current user points
router.get(
  "/points",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  getPoints,
);

export default router;
