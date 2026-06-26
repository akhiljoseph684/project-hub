import express from "express";
import { createOrder, getPlansByUser, getPlanById, getPlans, verifyPayment, updateUserPlan } from "../controllers/subscription.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyUser, getPlans);
router.post("/create-order", verifyUser, createOrder);
router.post("/verify-payment", verifyUser, verifyPayment);
router.get("/my-plans", verifyUser, getPlansByUser);
router.get("/:id", verifyUser, getPlanById);
router.patch("/:planId", verifyUser, updateUserPlan);


export default router;