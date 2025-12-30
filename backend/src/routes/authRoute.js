import { Router } from "express";
import { signUp, signIn, refreshToken, signOut } from "../controller/authController.js";

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/refresh-token", refreshToken);
router.post("/sign-out", signOut);

export default router;
