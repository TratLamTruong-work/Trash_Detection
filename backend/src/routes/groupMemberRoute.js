import { Router } from "express";
import {
  createGroupMember,
  updateGroupMember,
  getGroupMembers,
  getGroupMemberById,
  deleteGroupMember,
  deleteAllGroupMembers,
} from "../controller/groupMemberController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: GroupMember
 *   description: Group Member Management (Admin only)
 */

/**
 * @swagger
 * /api/group-members:
 *   post:
 *     summary: Create a new group member
 *     tags: [GroupMember]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupMember'
 *     responses:
 *       201:
 *         description: Group member created successfully
 *       400:
 *         description: Failed to create group member
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  createGroupMember,
);

/**
 * @swagger
 * /api/group-members:
 *   get:
 *     summary: Get all group members
 *     tags: [GroupMember]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Group members retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  getGroupMembers,
);

/**
 * @swagger
 * /api/group-members/{id}:
 *   get:
 *     summary: Get group member by ID
 *     tags: [GroupMember]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group member ID
 *     responses:
 *       200:
 *         description: Group member retrieved successfully
 *       404:
 *         description: Group member not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  getGroupMemberById,
);

/**
 * @swagger
 * /api/group-members/{id}:
 *   put:
 *     summary: Update group member by ID
 *     tags: [GroupMember]
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
 *             $ref: '#/components/schemas/GroupMember'
 *     responses:
 *       200:
 *         description: Group member updated successfully
 *       400:
 *         description: Failed to update group member
 *       404:
 *         description: Group member not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  updateGroupMember,
);

/**
 * @swagger
 * /api/group-members/{id}:
 *   delete:
 *     summary: Delete group member by ID
 *     tags: [GroupMember]
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
 *         description: Group member deleted successfully
 *       404:
 *         description: Group member not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteGroupMember,
);

/**
 * @swagger
 * /api/group-members:
 *   delete:
 *     summary: Delete all group members
 *     tags: [GroupMember]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All group members deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteAllGroupMembers,
);

export default router;