import { getProjectCalendar } from "../services/calendar.service.js";

export const getProjectCalendarController = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const calendar = await getProjectCalendar(projectId);

    return res.status(200).json({
      success: true,
      message: "Project calendar fetched successfully",
      data: calendar,
    });
  } catch (error) {
    console.error("Get project calendar error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch project calendar",
    });
  }
};