import { Router } from "express";
import {
  createCustomItem,
  updateCustomItem,
  getCustomItems,
  getCustomItemById,
  deleteCustomItem,
  deleteAllCustomItems,
} from "../controller/customItemController.js";
import { verifyToken } from "../middleware/tokenVerification.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: CustomItem
 *   description: Custom Item Management
 */

/**
 * @swagger
 * /api/custom-items:
 *   post:
 *     summary: Create a new custom item
 *     tags: [CustomItem]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomItem'
 *           example:
 *             name: "Premium Gift"
 *             pointToTrade: 50
 *             imageUrl: "https://example.com/premium.jpg"
 *             userId: "507f1f77bcf86cd799439012"
 *             groupId: "507f1f77bcf86cd799439013"
 *     responses:
 *       201:
 *         description: Custom item created successfully
 *       400:
 *         description: Failed to create custom item
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  verifyToken,
  createCustomItem,
);

/**
 * @swagger
 * /api/custom-items:
 *   get:
 *     summary: Get all custom items
 *     tags: [CustomItem]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of custom items
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  verifyToken,
  getCustomItems,
);

/**
 * @swagger
 * /api/custom-items/{id}:
 *   get:
 *     summary: Get custom item by ID
 *     tags: [CustomItem]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom item ID
 *     responses:
 *       200:
 *         description: Custom item retrieved successfully
 *       404:
 *         description: Custom item not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  verifyToken,
  getCustomItemById,
);

/**
 * @swagger
 * /api/custom-items/{id}:
 *   put:
 *     summary: Update custom item by ID
 *     tags: [CustomItem]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomItem'
 *           example:
 *             name: "Updated Premium Gift"
 *             pointToTrade: 75
 *             imageUrl: "https://example.com/updated-premium.jpg"
 *             userId: "507f1f77bcf86cd799439012"
 *             groupId: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Custom item updated successfully
 *       400:
 *         description: Failed to update custom item
 *       404:
 *         description: Custom item not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  verifyToken,
  updateCustomItem,
);

/**
 * @swagger
 * /api/custom-items/{id}:
 *   delete:
 *     summary: Delete custom item by ID
 *     tags: [CustomItem]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom item ID
 *     responses:
 *       200:
 *         description: Custom item deleted successfully
 *       404:
 *         description: Custom item not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  verifyToken,
  deleteCustomItem,
);

/**
 * @swagger
 * /api/custom-items:
 *   delete:
 *     summary: Delete all custom items
 *     tags: [CustomItem]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All custom items deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/",
  verifyToken,
  deleteAllCustomItems,
);

export default router;