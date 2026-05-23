import express from "express";
import { receiveBinStatus } from "../controllers/binController.js";

const router = express.Router();

// POST /api/bin-status
router.post("/", receiveBinStatus);

router.get("/", getCurrentBins);

export default router;