import { getUserAnalytics } from "../services/user-analytics.service.js";

export const getUserAnalyticsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const analytics = await getUserAnalytics({
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "User analytics fetched successfully",
      data: analytics,
    });
  } catch (error) {
    console.error("Get user analytics error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user analytics",
    });
  }
};
