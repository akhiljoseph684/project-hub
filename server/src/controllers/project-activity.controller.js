import { getProjectActivities } from "../services/project-activity.service.js";

export const getProjectActivitiesController = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const activities = await getProjectActivities({
      projectId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Project activities fetched successfully",
      activities,
    });
  } catch (error) {
    console.error("Get project activities error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch project activities",
    });
  }
};
