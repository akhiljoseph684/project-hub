import {
  createLabel,
  getProjectLabels,
  updateLabel,
  deleteLabel,
} from "../services/label.service.js";

export async function createLabelController(req, res) {
  try {
    const { projectId } = req.params;
    const { name, color } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Label name is required",
      });
    }

    if (!color || typeof color !== "string") {
      return res.status(400).json({
        success: false,
        message: "Label color is required",
      });
    }

    const label = await createLabel({
      projectId,
      name: name.trim(),
      color,
    });

    return res.status(201).json({
      success: true,
      message: "Label created successfully",
      label,
    });
  } catch (error) {
    console.error("Create label error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create label",
    });
  }
}

export async function getProjectLabelsController(req, res) {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const labels = await getProjectLabels(projectId);

    return res.status(200).json({
      success: true,
      labels,
    });
  } catch (error) {
    console.error("Get project labels error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to get labels",
    });
  }
}

export async function updateLabelController(req, res) {
  try {
    const { labelId } = req.params;
    const { name, color } = req.body;

    if (!labelId) {
      return res.status(400).json({
        success: false,
        message: "Label ID is required",
      });
    }

    if (name !== undefined && typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Label name must be a string",
      });
    }

    if (color !== undefined && typeof color !== "string") {
      return res.status(400).json({
        success: false,
        message: "Label color must be a string",
      });
    }

    if (name === undefined && color === undefined) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const label = await updateLabel(labelId, {
      ...(name !== undefined && {
        name: name.trim(),
      }),

      ...(color !== undefined && {
        color,
      }),
    });

    return res.status(200).json({
      success: true,
      message: "Label updated successfully",
      label,
    });
  } catch (error) {
    console.error("Update label error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update label",
    });
  }
}

export async function deleteLabelController(req, res) {
  try {
    const { labelId } = req.params;

    if (!labelId) {
      return res.status(400).json({
        success: false,
        message: "Label ID is required",
      });
    }

    const result = await deleteLabel(labelId);

    return res.status(200).json({
      success: true,
      message: "Label deleted successfully",
      labelId: result.id,
    });
  } catch (error) {
    console.error("Delete label error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete label",
    });
  }
}
