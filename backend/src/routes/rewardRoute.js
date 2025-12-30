import { Router } from "express";
import {
  getAllRewards,
  getRewardById,
  tradeReward,
  getTradeHistory,
} from "../controller/rewardController.js";
import { verifyToken } from "../middleware/tokenVerification.js";

const router = Router();

router.get("/", getAllRewards);
router.get("/:id", getRewardById);

router.post("/trade", verifyToken, tradeReward);
router.get("/history/me", verifyToken, getTradeHistory);

export default router;
