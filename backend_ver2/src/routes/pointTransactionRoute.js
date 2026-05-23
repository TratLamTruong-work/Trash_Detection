import { Router } from "express";

import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import {
  getAllTransactions,
  getTransactionById,
  deleteTransaction,
  updateTransactionStatus,
} from "../controllers/pointTransactionController.js";

const router = Router();

router.get("/", verifyToken, verifyAdmin, getAllTransactions);
router.get("/:id", verifyToken, verifyAdmin, getTransactionById);
router.delete("/:id", verifyToken, verifyAdmin, deleteTransaction);
router.patch("/:id/status", verifyToken, verifyAdmin, updateTransactionStatus);

export default router;
