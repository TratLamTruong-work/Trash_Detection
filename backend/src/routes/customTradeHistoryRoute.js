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

// Admin only routes - Custom trade history management
// POST / - Create a new custom trade history (Admin only)
router.post(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  createCustomTradeHistory,
);
// GET / - Get all custom trade histories (Admin only)
router.get(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  getCustomTradeHistories,
);
// GET /:id - Get custom trade history by ID (Admin only)
router.get(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  getCustomTradeHistoryById,
);
// PUT /:id - Update custom trade history by ID (Admin only)
router.put(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  updateCustomTradeHistory,
);
// DELETE /:id - Delete custom trade history by ID (Admin only)
router.delete(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteCustomTradeHistory,
);
// DELETE / - Delete all custom trade histories (Admin only)
router.delete(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteAllCustomTradeHistories,
);

export default router;
