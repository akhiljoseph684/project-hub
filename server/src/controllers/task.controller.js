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