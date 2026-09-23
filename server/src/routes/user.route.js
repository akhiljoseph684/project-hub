import express from "express";

import {
  getUserDashboardController,
  updateProfile,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { getUserAnalyticsController } from "../controllers/user-analytics.controller.js";

const router = express.Router();

router.get("/profile", verifyUser, updateProfile);
router.patch("/profile", verifyUser, upload.single("avatar"), updateProfile);
router.get("/dashboard", verifyUser, getUserDashboardController);
router.get("/analytics", verifyUser, getUserAnalyticsController);

export default router;
