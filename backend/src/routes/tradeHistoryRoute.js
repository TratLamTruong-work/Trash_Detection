import { Router } from "express";
import {
  createTradeHistory,
  updateTradeHistory,
  getTradeHistories,
  getTradeHistoryById,
  deleteTradeHistory,
  deleteAllTradeHistories,
} from "../controller/tradeHistoryController.js";
import { verifyToken } from "../middleware/tokenVerification.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TradeHistory
 *   description: Trade History Management
 */

/**
 * @swagger
 * /api/trade-histories:
 *   post:
 *     summary: Create a new trade history
 *     tags: [TradeHistory]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TradeHistory'
 *           example:
 *             userId: "507f1f77bcf86cd799439012"
 *             itemId: "507f1f77bcf86cd799439013"
 *             itemName: "Gift Card"
 *             quantity: 1
 *             pointsSpent: 100
 *             prevPoint: 500
 *             remainPoint: 400
 *     responses:
 *       201:
 *         description: Trade history created successfully
 *       400:
 *         description: Failed to create trade history
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  verifyToken,
  createTradeHistory,
);

/**
 * @swagger
 * /api/trade-histories:
 *   get:
 *     summary: Get all trade histories
 *     tags: [TradeHistory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Trade histories retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  verifyToken,
  getTradeHistories,
);

/**
 * @swagger
 * /api/trade-histories/{id}:
 *   get:
 *     summary: Get trade history by ID
 *     tags: [TradeHistory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trade history ID
 *     responses:
 *       200:
 *         description: Trade history retrieved successfully
 *       404:
 *         description: Trade history not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  verifyToken,
  getTradeHistoryById,
);

/**
 * @swagger
 * /api/trade-histories/{id}:
 *   put:
 *     summary: Update trade history by ID
 *     tags: [TradeHistory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trade history ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TradeHistory'
 *           example:
 *             userId: "507f1f77bcf86cd799439012"
 *             itemId: "507f1f77bcf86cd799439013"
 *             itemName: "Updated Gift Card"
 *             quantity: 2
 *             pointsSpent: 200
 *             prevPoint: 500
 *             remainPoint: 300
 *     responses:
 *       200:
 *         description: Trade history updated successfully
 *       400:
 *         description: Failed to update trade history
 *       404:
 *         description: Trade history not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  verifyToken,
  updateTradeHistory,
);

/**
 * @swagger
 * /api/trade-histories/{id}:
 *   delete:
 *     summary: Delete trade history by ID
 *     tags: [TradeHistory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trade history ID
 *     responses:
 *       200:
 *         description: Trade history deleted successfully
 *       404:
 *         description: Trade history not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  verifyToken,
  deleteTradeHistory,
);

/**
 * @swagger
 * /api/trade-histories:
 *   delete:
 *     summary: Delete all trade histories
 *     tags: [TradeHistory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All trade histories deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/",
  verifyToken,
  deleteAllTradeHistories,
);

export default router;