import { Router } from "express";
import { verifyOTP, registerUser, loginUser, resendOTP, logoutUser, updateProfile, refreshAccessToken, changePassword } from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);

//secure route
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.patch("/update-account", verifyJwt, updateProfile);
router.patch("/change-password", verifyJwt, changePassword);

export default router;