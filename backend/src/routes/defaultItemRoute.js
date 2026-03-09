import { Router } from "express";
import {
  createDefaultItem,
  updateDefaultItem,
  getDefaultItems,
  getDefaultItemById,
  deleteDefaultItem,
  deleteAllDefaultItems,
} from "../controller/defaultItemController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";
import UserRole from "../enum/userRole.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: DefaultItem
 *   description: Default Item Management
 */

/**
 * @swagger
 * /api/default-items:
 *   get:
 *     summary: Get all default items (Public)
 *     tags: [DefaultItem]
 *     responses:
 *       200:
 *         description: Default items retrieved successfully
 *       500:
 *         description: Failed to retrieve default items
 */
router.get("/", getDefaultItems);

/**
 * @swagger
 * /api/default-items/{id}:
 *   get:
 *     summary: Get default item by ID (Public)
 *     tags: [DefaultItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Default item ID
 *     responses:
 *       200:
 *         description: Default item retrieved successfully
 *       404:
 *         description: Default item not found
 *       500:
 *         description: Failed to retrieve default item
 */
router.get("/:id", getDefaultItemById);

/**
 * @swagger
 * /api/default-items:
 *   post:
 *     summary: Create a new default item (Admin only)
 *     tags: [DefaultItem]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DefaultItem'
 *           example:
 *             name: "Gift Card"
 *             pointToTrade: 100
 *             imageUrl: "https://example.com/gift-card.jpg"
 *     responses:
 *       201:
 *         description: Default item created successfully
 *       400:
 *         description: Failed to create default item
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.post(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  createDefaultItem,
);

/**
 * @swagger
 * /api/default-items/{id}:
 *   put:
 *     summary: Update default item by ID (Admin only)
 *     tags: [DefaultItem]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Default item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DefaultItem'
 *           example:
 *             name: "Updated Gift Card"
 *             pointToTrade: 150
 *             imageUrl: "https://example.com/updated-gift.jpg"
 *     responses:
 *       200:
 *         description: Default item updated successfully
 *       400:
 *         description: Failed to update default item
 *       404:
 *         description: Default item not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.put(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  updateDefaultItem,
);

/**
 * @swagger
 * /api/default-items/{id}:
 *   delete:
 *     summary: Delete default item by ID (Admin only)
 *     tags: [DefaultItem]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Default item ID
 *     responses:
 *       200:
 *         description: Default item deleted successfully
 *       404:
 *         description: Default item not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.delete(
  "/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteDefaultItem,
);

/**
 * @swagger
 * /api/default-items:
 *   delete:
 *     summary: Delete all default items (Admin only)
 *     tags: [DefaultItem]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All default items deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.delete(
  "/",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  deleteAllDefaultItems,
);

export default router;