import express from "express";
import { add, getMe, login, logout, register, resendOTP, verifyOTP } from "../controllers/auth.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.get("/me", verifyUser, getMe);
router.get("/add", add);

export default router;