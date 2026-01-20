import { Router } from "express";
import {
  createCustomItem,
  updateCustomItem,
  getCustomItems,
  getCustomItemById,
  deleteCustomItem,
  deleteAllCustomItems,
} from "../controller/customItemController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

// Admin only routes - Custom item management
// POST / - Create a new custom item (Admin only)
router.post("/", verifyToken, verifyRole([UserRole.ADMIN]), createCustomItem);
// GET / - Get all custom items (Admin only)
router.get("/", verifyToken, verifyRole([UserRole.ADMIN]), getCustomItems);
// GET /:id - Get custom item by ID (Admin only)
router.get(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  getCustomItemById,
);
// PUT /:id - Update custom item by ID (Admin only)
router.put("/:id", verifyToken, verifyRole([UserRole.ADMIN]), updateCustomItem);
// DELETE /:id - Delete custom item by ID (Admin only)
router.delete(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteCustomItem,
);
// DELETE / - Delete all custom items (Admin only)
router.delete(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteAllCustomItems,
);

export default router;
