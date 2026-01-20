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

// Public routes (no authentication required) - Reward browsing
// GET / - Get all rewards
router.get("/", getAllRewards);
// GET /:id - Get reward details by ID
router.get("/:id", getRewardById);

// Authenticated user routes (admin and user) - Trade management
// POST /trade - Trade reward with points
router.post(
  "/trade",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  tradeReward,
);
// GET /history/me - Get current user trade history
router.get(
  "/history/me",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  getTradeHistory,
);

export default router;
