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

/**
 * @swagger
 * tags:
 *   name: UserProfile
 *   description: User Profile Management (Authenticated users)
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [UserProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/profile",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  getProfile,
);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update current user profile
 *     tags: [UserProfile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               birthDate:
 *                 type: string
 *                 format: date
 *               male:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/profile",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  updateProfile,
);

/**
 * @swagger
 * /api/user/upload-icon:
 *   post:
 *     summary: Upload user profile icon
 *     tags: [UserProfile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - iconFile
 *             properties:
 *               iconFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Icon uploaded successfully
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/upload-icon",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  uploadIcon,
);

/**
 * @swagger
 * /api/user/points:
 *   get:
 *     summary: Get current user points
 *     tags: [UserProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Points retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/points",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  getPoints,
);

export default router;