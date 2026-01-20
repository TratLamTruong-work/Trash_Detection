import { Router } from "express";
import {
  createGroupMember,
  updateGroupMember,
  getGroupMembers,
  getGroupMemberById,
  deleteGroupMember,
  deleteAllGroupMembers,
} from "../controller/groupMemberController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

// Admin only routes - Group member management
// POST / - Create a new group member (Admin only)
router.post("/", verifyToken, verifyRole([UserRole.ADMIN]), createGroupMember);
// GET / - Get all group members (Admin only)
router.get("/", verifyToken, verifyRole([UserRole.ADMIN]), getGroupMembers);
// GET /:id - Get group member by ID (Admin only)
router.get(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  getGroupMemberById,
);
// PUT /:id - Update group member by ID (Admin only)
router.put(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  updateGroupMember,
);
// DELETE /:id - Delete group member by ID (Admin only)
router.delete(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteGroupMember,
);
// DELETE / - Delete all group members (Admin only)
router.delete(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteAllGroupMembers,
);

export default router;
