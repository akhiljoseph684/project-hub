import express from "express";

import { verifyUser } from "../middleware/auth.middleware.js";
import {
  createTaskController,
  deleteTaskAttachmentController,
  getTaskByIdController,
  getTasksByProjectController,
  updateTaskStatusController,
  uploadTaskAttachmentController,
} from "../controllers/task.controller.js";
import { requireProjectPermission } from "../middleware/project-permission.middleware.js";
import { PERMISSIONS } from "../../constants/permissions.js";
import { uploadTaskAttachment } from "../middleware/upload-attachment.middleware.js";

const router = express.Router();

router.post(
  "/:projectId/",
  verifyUser,
  requireProjectPermission(PERMISSIONS.TASK_CREATE),
  createTaskController,
);
router.patch(
  "/:projectId/:taskId/status",
  verifyUser,
  updateTaskStatusController,
);

router.get("/projects/:projectId", verifyUser, getTasksByProjectController);

router.post(
  "/:taskId/attachments",
  verifyUser,
  uploadTaskAttachment,
  uploadTaskAttachmentController,
);

router.delete(
    "/attachments/:attachmentId",
    verifyUser,
    deleteTaskAttachmentController,
);

router.get("/:taskId", verifyUser, getTaskByIdController);

export default router;
