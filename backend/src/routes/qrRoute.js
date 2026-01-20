import { Router } from "express";
import {
  generateQRCode,
  scanQRCode,
  getAllQRCodes,
  getUserQRHistory,
} from "../controller/qrController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

// Public routes (no authentication required) - QR code generation and browsing
// POST /generate - Generate new QR code
router.post("/generate", generateQRCode);
// GET /all - Get all QR codes
router.get("/all", getAllQRCodes);

// Authenticated user routes (admin and user) - QR code scanning and history
// POST /scan - Scan QR code
router.post(
  "/scan",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  scanQRCode,
);
// GET /history/me - Get current user QR scan history
router.get(
  "/history/me",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  getUserQRHistory,
);

export default router;
