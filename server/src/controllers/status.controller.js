import { deleteProjectStatus } from "../services/status.service.js";
import { createProjectStatus } from "../services/status.service.js";

export async function createStatusController(req, res) {
  try {
    const { projectId } = req.params;

    const { name, color } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Status name is required",
      });
    }

    if (!color || !color.trim()) {
      return res.status(400).json({
        success: false,
        message: "Status color is required",
      });
    }

    const status = await createProjectStatus({
      projectId,
      name,
      color,
    });

    return res.status(201).json({
      success: true,
      message: "Status created successfully",
      status,
    });
  } catch (error) {
    console.error("Create status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create project status",
    });
  }
}

export async function deleteStatusController(req, res) {
  try {
    const { statusId } = req.params;

    if (!statusId) {
      return res.status(400).json({
        success: false,
        message: "Status ID is required",
      });
    }

    await deleteProjectStatus(statusId);

    return res.status(200).json({
      success: true,
      message: "Status deleted successfully",
    });
  } catch (error) {
    console.error("Delete status error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete status",
    });
  }
}
