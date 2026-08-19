import express from "express";

import { verifyUser } from "../middleware/auth.middleware.js";
import { createTaskController, updateTaskStatusController } from "../controllers/task.controller.js";
import { requireProjectPermission } from "../middleware/project-permission.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.js";

const router = express.Router();

router.post("/:projectId/", verifyUser, requireProjectPermission(PERMISSIONS.TASK_CREATE), createTaskController);
router.patch("/:projectId/:taskId/status", verifyUser, updateTaskStatusController);

export default router;
