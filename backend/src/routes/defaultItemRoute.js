import { Router } from "express";
import {
  createDefaultItem,
  updateDefaultItem,
  getDefaultItems,
  getDefaultItemById,
  deleteDefaultItem,
  deleteAllDefaultItems,
} from "../controller/defaultItemController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

// Public routes - Default item browsing
// GET / - Get all default items
router.get("/", getDefaultItems);
// GET /:id - Get default item by ID
router.get("/:id", getDefaultItemById);

// Admin only routes - Default item management
// POST / - Create a new default item (Admin only)
router.post("/", verifyToken, verifyRole([UserRole.ADMIN]), createDefaultItem);
// PUT /:id - Update default item by ID (Admin only)
router.put(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  updateDefaultItem,
);
// DELETE /:id - Delete default item by ID (Admin only)
router.delete(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteDefaultItem,
);
// DELETE / - Delete all default items (Admin only)
router.delete(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteAllDefaultItems,
);

export default router;
