import { Router } from "express";
import {
  createGroup,
  updateGroup,
  getGroups,
  getGroupById,
  deleteGroup,
  deleteAllGroups,
} from "../controller/groupController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

// Public routes - Group browsing
// GET / - Get all groups
router.get("/", getGroups);
// GET /:id - Get group by ID
router.get("/:id", getGroupById);

// Admin only routes - Group management
// POST / - Create a new group (Admin only)
router.post("/", verifyToken, verifyRole([UserRole.ADMIN]), createGroup);
// PUT /:id - Update group by ID (Admin only)
router.put("/:id", verifyToken, verifyRole([UserRole.ADMIN]), updateGroup);
// DELETE /:id - Delete group by ID (Admin only)
router.delete("/:id", verifyToken, verifyRole([UserRole.ADMIN]), deleteGroup);
// DELETE / - Delete all groups (Admin only)
router.delete("/", verifyToken, verifyRole([UserRole.ADMIN]), deleteAllGroups);

export default router;
