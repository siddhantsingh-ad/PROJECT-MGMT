import {Router} from "express";
import { Login,Register} from "../controllers/auth/AuthController"
import {VerifyOtp,ResendOTPVerification} from "../controllers/auth/OtpController";
import {ResetPassword,ForgotPassword} from "../controllers/auth/PasswordController";

const router = Router();


router.post("/register",Register);
router.post("/login",Login);
router.post("/verifyOTP", VerifyOtp)
router.post("/resendOTPVerification",ResendOTPVerification)
router.post("/forgotPassword",ForgotPassword)
router.post("/resetPassword", ResetPassword);

export default router;
