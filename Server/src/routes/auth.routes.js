import { Router } from "express";
import { verifyOTP, registerUser, loginUser } from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);

export default router;