import { Router } from "express";

import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import {
  getAllUsers,
  getUserById,
  updateUserInfo,
  deleteUser,
} from "../controllers/usersController.js";

const router = Router();

// APIs
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUserInfo);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

export default router;
