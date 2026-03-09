import { Router } from "express";
import {
  getAllRewards,
  getRewardById,
  tradeReward,
  getTradeHistory,
} from "../controller/rewardController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reward
 *   description: Reward Browsing & Trading
 */

/**
 * @swagger
 * /api/rewards:
 *   get:
 *     summary: Get all rewards (Public)
 *     tags: [Reward]
 *     responses:
 *       200:
 *         description: Reward list retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", getAllRewards);

/**
 * @swagger
 * /api/rewards/{id}:
 *   get:
 *     summary: Get reward by ID (Public)
 *     tags: [Reward]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reward retrieved successfully
 *       404:
 *         description: Reward not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getRewardById);

/**
 * @swagger
 * /api/rewards/trade:
 *   post:
 *     summary: Trade reward using points (User/Admin)
 *     tags: [Reward]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *             properties:
 *               itemId:
 *                 type: string
 *                 example: "65f1a9d8c2b3e12a34567890"
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Trade successful
 *       400:
 *         description: Invalid request or insufficient points
 *       404:
 *         description: User or reward not found
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/trade",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  tradeReward,
);

/**
 * @swagger
 * /api/rewards/history/me:
 *   get:
 *     summary: Get current user trade history
 *     tags: [Reward]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trade history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/history/me",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  getTradeHistory,
);

export default router;