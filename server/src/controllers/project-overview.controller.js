import { getProjectOverview } from "../services/project-overview.service.js";

export const getProjectOverviewController = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const overview = await getProjectOverview({
      projectId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Project overview fetched successfully",
      data: overview,
    });
  } catch (error) {
    console.error("Get project overview error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch project overview",
    });
  }
};