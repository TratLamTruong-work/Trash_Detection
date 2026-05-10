import { Router } from "express";

import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/itemsController.js";

const router = Router();

// APIs
router.post("/", verifyToken, verifyAdmin, createItem);
router.get("/", verifyToken, getAllItems);
router.get("/:id", verifyToken, getItemById);
router.put("/:id", verifyToken, verifyAdmin, updateItem);
router.delete("/:id", verifyToken, verifyAdmin, deleteItem);

export default router;
