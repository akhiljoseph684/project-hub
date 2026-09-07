import {
  getTaskChecklists,
  createTaskChecklist,
  updateTaskChecklist,
  deleteTaskChecklist,
} from "../services/task-checklist.service.js";

export const getTaskChecklistsController = async (req, res) => {
  try {
    const { taskId } = req.params;

    const checklists = await getTaskChecklists({
      taskId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      data: checklists,
    });
  } catch (error) {
    console.error("Get task checklists error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch checklists",
    });
  }
};

export const createTaskChecklistController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    const checklist = await createTaskChecklist({
      taskId,
      userId: req.user.id,
      title,
    });

    return res.status(201).json({
      success: true,
      message: "Checklist created successfully",
      data: checklist,
    });
  } catch (error) {
    console.error("Create task checklist error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create checklist",
    });
  }
};

export const updateTaskChecklistController = async (req, res) => {
  try {
    const { checklistId } = req.params;

    const checklist = await updateTaskChecklist({
      checklistId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Checklist updated successfully",
      data: checklist,
    });
  } catch (error) {
    console.error("Update task checklist error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update checklist",
    });
  }
};

export const deleteTaskChecklistController = async (req, res) => {
  try {
    const { checklistId } = req.params;

    const result = await deleteTaskChecklist({
      checklistId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Checklist deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete task checklist error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete checklist",
    });
  }
};
