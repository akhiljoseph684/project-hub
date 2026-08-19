import express from "express";

import { createStatusController, deleteStatusController } from "../controllers/status.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/project/:projectId", verifyUser, createStatusController);
router.delete("/:statusId", verifyUser, deleteStatusController);

export default router;
