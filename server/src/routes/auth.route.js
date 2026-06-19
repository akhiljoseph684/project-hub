import express from "express";
import { getMe, login, register, resendOTP, verifyOTP } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.get("/me", getMe);

export default router;