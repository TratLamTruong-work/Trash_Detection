import { Router } from "express";
import {
  createGroup,
  updateGroup,
  getGroups,
  getGroupById,
  deleteGroup,
  deleteAllGroups,
} from "../controller/groupController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Group
 *   description: Group Management
 */

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups (Public)
 *     tags: [Group]
 *     responses:
 *       200:
 *         description: Groups retrieved successfully
 *       500:
 *         description: Failed to retrieve groups
 */
router.get("/", getGroups);

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get group by ID (Public)
 *     tags: [Group]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group retrieved successfully
 *       404:
 *         description: Group not found
 *       500:
 *         description: Failed to retrieve group
 */
router.get("/:id", getGroupById);

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group (Admin only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Failed to create group
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  createGroup,
);

/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Update group by ID (Admin only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       400:
 *         description: Failed to update group
 *       404:
 *         description: Group not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  updateGroup,
);

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete group by ID (Admin only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteGroup,
);

/**
 * @swagger
 * /api/groups:
 *   delete:
 *     summary: Delete all groups (Admin only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All groups deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteAllGroups,
);

export default router;