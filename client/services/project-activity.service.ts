import api from "@/lib/axios";

export const getProjectActivities = async (projectId: string) => {
  try {
    const res = await api.get(`/projects/${projectId}/activity`);

    return res.data;
  } catch (error: any) {
    console.error("Failed to fetch project activities:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};
