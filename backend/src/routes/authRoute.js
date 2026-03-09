import { Router } from "express";
import {
  signUp,
  signIn,
  refreshToken,
  signOut,
} from "../controller/authController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *               - firstName
 *               - lastName
 *               - email
 *               - birthDate
 *               - male
 *             properties:
 *               userName:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: 123456
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               birthDate:
 *                 type: string
 *                 example: 2000-01-01
 *               male:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Register success
 *       400:
 *         description: Validation error
 */
router.post("/sign-up", signUp);

/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login success
 *       401:
 *         description: Invalid credentials
 */
router.post("/sign-in", signIn);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Refresh token success
 *       401:
 *         description: No refresh token
 *       403:
 *         description: Invalid refresh token
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/auth/sign-out:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout success
 */
router.post("/sign-out", signOut);

export default router;
