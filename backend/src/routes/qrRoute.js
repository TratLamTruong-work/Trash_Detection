import { Router } from "express";
import {
  generateQRCode,
  scanQRCode,
  getAllQRCodes,
  getUserQRHistory,
} from "../controller/qrController.js";
import { verifyToken } from "../middleware/tokenVerification.js";

const router = Router();

router.post("/generate", generateQRCode);

router.post("/scan", verifyToken, scanQRCode);
router.get("/all", getAllQRCodes);
router.get("/history/me", verifyToken, getUserQRHistory);

export default router;
