import express from "express";

import { verifyUser } from "../middleware/auth.middleware.js";
import { createTaskController, updateTaskStatusController } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/:projectId/", verifyUser, createTaskController);
router.patch("/:taskId/status", verifyUser, updateTaskStatusController);

export default router;
