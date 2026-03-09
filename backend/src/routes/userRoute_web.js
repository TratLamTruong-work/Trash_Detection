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

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Management (Admin only)
 */

/**
 * @swagger
 * /api/users/create-user:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - iconFile
 *             properties:
 *               userName:
 *                 type: string
 *                 example: johndoe
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
 *                 example: true
 *               iconFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Permission denied
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/create-user",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  createUser,
);

/**
 * @swagger
 * /api/users/update-user:
 *   post:
 *     summary: Update user information (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Permission denied
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/update-user",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  updateUser,
);

/**
 * @swagger
 * /api/users/delete-user:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65f1a9d8c2b3e12a34567890"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Permission denied
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/delete-user",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteUser,
);

export default router;