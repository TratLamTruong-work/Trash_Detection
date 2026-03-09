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

/**
 * @swagger
 * tags:
 *   name: QRCode
 *   description: QR Code Management & Scanning
 */

/**
 * @swagger
 * /api/qr/generate:
 *   post:
 *     summary: Generate new QR code (Public)
 *     tags: [QRCode]
 *     responses:
 *       201:
 *         description: QR code generated successfully
 *       500:
 *         description: Server error
 */
router.post("/generate", generateQRCode);

/**
 * @swagger
 * /api/qr/all:
 *   get:
 *     summary: Get all QR codes (Public)
 *     tags: [QRCode]
 *     parameters:
 *       - in: query
 *         name: isUsed
 *         schema:
 *           type: boolean
 *         description: Filter QR codes by usage status
 *     responses:
 *       200:
 *         description: QR codes retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/all", getAllQRCodes);

/**
 * @swagger
 * /api/qr/scan:
 *   post:
 *     summary: Scan QR code (User/Admin)
 *     tags: [QRCode]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "a1b2c3d4e5f6g7h8"
 *     responses:
 *       200:
 *         description: QR scanned successfully
 *       400:
 *         description: Invalid or already used QR
 *       404:
 *         description: QR or user not found
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/scan",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  scanQRCode,
);

/**
 * @swagger
 * /api/qr/history/me:
 *   get:
 *     summary: Get current user QR scan history
 *     tags: [QRCode]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/history/me",
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.USER]),
  getUserQRHistory,
);

export default router;