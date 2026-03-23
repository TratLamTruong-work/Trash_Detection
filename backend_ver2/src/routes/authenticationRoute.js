import { Router } from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authenticationController.js";

const router = Router();

// APIs
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
