import { createTaskAttachment, deleteTaskAttachment } from "../services/task-attachment.service.js";
import * as taskService from "../services/task.service.js";

export const createTaskController = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const task = await taskService.createTask({
      projectId,
      userId: req.user.id,
      body: req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export async function updateTaskStatusController(req, res) {
  try {
    const { taskId } = req.params;
    const { statusId } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    if (!statusId) {
      return res.status(400).json({
        success: false,
        message: "Status ID is required",
      });
    }

    const task = await taskService.updateTaskStatus(taskId, statusId);

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update task status",
    });
  }
}

export async function getTasksByProjectController(req, res) {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const tasks = await taskService.getTasksByProject(projectId);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.error("Get tasks by project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
}

export async function uploadTaskAttachmentController(req, res) {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file",
      });
    }

    const attachment = await createTaskAttachment({
      taskId,

      uploadedById: req.user.id,

      file: req.file,
    });

    return res.status(201).json({
      success: true,

      message: "Attachment uploaded successfully",

      attachment,
    });
  } catch (error) {
    console.error("Upload task attachment error:", error);

    return res.status(500).json({
      success: false,

      message: error.message || "Failed to upload attachment",
    });
  }
}

export async function getTaskByIdController(req, res) {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    const task = await taskService.getTaskById(taskId);

    return res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    if (error.message === "Task not found") {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
}

export async function deleteTaskAttachmentController(req, res) {
  try {
    const { attachmentId } = req.params;

    if (!attachmentId) {
      return res.status(400).json({
        success: false,
        message: "Attachment ID is required",
      });
    }

    const result = await deleteTaskAttachment({
      attachmentId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Attachment deleted successfully",
      attachmentId: result.id,
    });
  } catch (error) {
    console.error("Delete task attachment error:", error);

    if (error.message === "Attachment not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete attachment",
    });
  }
}
