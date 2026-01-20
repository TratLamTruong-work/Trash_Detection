import { Router } from "express";
import {
  signUp,
  signIn,
  refreshToken,
  signOut,
} from "../controller/authController.js";

const router = Router();

// Public routes (no authentication required)
// POST /sign-up - Register new user
router.post("/sign-up", signUp);
// POST /sign-in - Login user
router.post("/sign-in", signIn);
// POST /refresh-token - Refresh expired token
router.post("/refresh-token", refreshToken);
// POST /sign-out - Logout user
router.post("/sign-out", signOut);

export default router;
