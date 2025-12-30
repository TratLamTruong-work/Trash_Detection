import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadIcon,
  getPoints,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/tokenVerification.js";

const router = Router();

router.use(verifyToken);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/upload-icon", uploadIcon);
router.get("/points", getPoints);

export default router;
