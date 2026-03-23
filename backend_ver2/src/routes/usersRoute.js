import { Router } from "express";

import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import {
  getAllUsers,
  updateUserInfo,
  deleteUser,
} from "../controllers/usersController.js";

const router = Router();

// APIs
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.put("/:id", verifyToken, updateUserInfo);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

export default router;
