import { Router } from "express";
import {
  createCustomTradeHistory,
  updateCustomTradeHistory,
  getCustomTradeHistories,
  getCustomTradeHistoryById,
  deleteCustomTradeHistory,
  deleteAllCustomTradeHistories,
} from "../controller/customTradeHistoryController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CustomTradeHistory
 *   description: Custom Trade History Management (Admin only)
 */

/**
 * @swagger
 * /api/custom-trade-histories:
 *   post:
 *     summary: Create a new custom trade history (Admin only)
 *     tags: [CustomTradeHistory]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomTradeHistory'
 *     responses:
 *       201:
 *         description: Custom trade history created successfully
 *       400:
 *         description: Failed to create custom trade history
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.post(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  createCustomTradeHistory,
);

/**
 * @swagger
 * /api/custom-trade-histories:
 *   get:
 *     summary: Get all custom trade histories (Admin only)
 *     tags: [CustomTradeHistory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of custom trade histories
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  getCustomTradeHistories,
);

/**
 * @swagger
 * /api/custom-trade-histories/{id}:
 *   get:
 *     summary: Get custom trade history by ID (Admin only)
 *     tags: [CustomTradeHistory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom trade history ID
 *     responses:
 *       200:
 *         description: Custom trade history retrieved successfully
 *       404:
 *         description: Custom trade history not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  getCustomTradeHistoryById,
);

/**
 * @swagger
 * /api/custom-trade-histories/{id}:
 *   put:
 *     summary: Update custom trade history by ID (Admin only)
 *     tags: [CustomTradeHistory]
 *     security:
 *       - BearerAuth: []
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
 *             $ref: '#/components/schemas/CustomTradeHistory'
 *     responses:
 *       200:
 *         description: Custom trade history updated successfully
 *       400:
 *         description: Failed to update custom trade history
 *       404:
 *         description: Custom trade history not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.put(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  updateCustomTradeHistory,
);

/**
 * @swagger
 * /api/custom-trade-histories/{id}:
 *   delete:
 *     summary: Delete custom trade history by ID (Admin only)
 *     tags: [CustomTradeHistory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Custom trade history deleted successfully
 *       404:
 *         description: Custom trade history not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.delete(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteCustomTradeHistory,
);

/**
 * @swagger
 * /api/custom-trade-histories:
 *   delete:
 *     summary: Delete all custom trade histories (Admin only)
 *     tags: [CustomTradeHistory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All custom trade histories deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.delete(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteAllCustomTradeHistories,
);

export default router;