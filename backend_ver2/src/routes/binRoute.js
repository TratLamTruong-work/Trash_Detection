import express from "express";
import { receiveDistance } from "../controllers/binController.js";

const router = express.Router();

// POST /api/bin-status
router.post("/", receiveBinStatus);

export default router;