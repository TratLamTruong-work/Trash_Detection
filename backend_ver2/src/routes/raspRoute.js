import express from "express";
import { receiveDistance } from "../controllers/raspController.js";

const router = express.Router();

// POST /api/distance
router.post("/", receiveDistance);

export default router;