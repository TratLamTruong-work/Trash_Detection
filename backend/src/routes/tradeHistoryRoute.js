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
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

// Admin only routes - Trade history management
// POST / - Create a new trade history (Admin only)
router.post("/", verifyToken, verifyRole([UserRole.ADMIN]), createTradeHistory);
// GET / - Get all trade histories (Admin only)
router.get("/", verifyToken, verifyRole([UserRole.ADMIN]), getTradeHistories);
// GET /:id - Get trade history by ID (Admin only)
router.get(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  getTradeHistoryById,
);
// PUT /:id - Update trade history by ID (Admin only)
router.put(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  updateTradeHistory,
);
// DELETE /:id - Delete trade history by ID (Admin only)
router.delete(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteTradeHistory,
);
// DELETE / - Delete all trade histories (Admin only)
router.delete(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteAllTradeHistories,
);

export default router;
