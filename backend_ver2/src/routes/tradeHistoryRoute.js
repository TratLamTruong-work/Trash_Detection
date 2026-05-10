import { Router } from "express";

import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import {
  createTradeHistory,
  getAllTradeHistories,
  deleteTradeHistory,
  deleteAllTradeHistories,
} from "../controllers/tradeHistoryController.js";

const router = Router();

// APIs
router.post("/", verifyToken, verifyAdmin, createTradeHistory);
router.get("/", verifyToken, verifyAdmin, getAllTradeHistories);
router.delete("/", verifyToken, verifyAdmin, deleteAllTradeHistories);
router.delete("/:id", verifyToken, verifyAdmin, deleteTradeHistory);

export default router;
