import {
  createSprint,
  getProjectSprints,
  getSprintById,
  updateSprint,
  startSprint,
  completeSprint,
  deleteSprint,
  getMySprints,
} from "../services/sprint.service.js";

export const createSprintController = async (req, res) => {
  try {
    const { projectId } = req.params;

    const sprint = await createSprint(projectId, req.body);

    return res.status(201).json({
      success: true,
      message: "Sprint created successfully",
      data: sprint,
    });
  } catch (error) {
    console.error("Create sprint error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create sprint",
    });
  }
};

export const getProjectSprintsController = async (req, res) => {
  try {
    const { projectId } = req.params;

    const sprints = await getProjectSprints(projectId);

    return res.status(200).json({
      success: true,
      data: sprints,
    });
  } catch (error) {
    console.error("Get project sprints error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch sprints",
    });
  }
};

export const getSprintByIdController = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await getSprintById(sprintId);

    return res.status(200).json({
      success: true,
      data: sprint,
    });
  } catch (error) {
    console.error("Get sprint error:", error);

    return res.status(404).json({
      success: false,
      message: error.message || "Sprint not found",
    });
  }
};

export const updateSprintController = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await updateSprint(sprintId, req.body);

    return res.status(200).json({
      success: true,
      message: "Sprint updated successfully",
      data: sprint,
    });
  } catch (error) {
    console.error("Update sprint error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update sprint",
    });
  }
};

export const startSprintController = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await startSprint(sprintId);

    return res.status(200).json({
      success: true,
      message: "Sprint started successfully",
      data: sprint,
    });
  } catch (error) {
    console.error("Start sprint error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to start sprint",
    });
  }
};

export const completeSprintController = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await completeSprint(sprintId);

    return res.status(200).json({
      success: true,
      message: "Sprint completed successfully",
      data: sprint,
    });
  } catch (error) {
    console.error("Complete sprint error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to complete sprint",
    });
  }
};

export const deleteSprintController = async (req, res) => {
  try {
    const { sprintId } = req.params;

    await deleteSprint(sprintId);

    return res.status(200).json({
      success: true,
      message: "Sprint deleted successfully",
    });
  } catch (error) {
    console.error("Delete sprint error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete sprint",
    });
  }
};

export const getMySprintsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const sprints = await getMySprints(userId);

    return res.status(200).json({
      success: true,
      message: "Sprints fetched successfully",
      sprints,
    });
  } catch (error) {
    console.error("Get my sprints error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch sprints",
    });
  }
};