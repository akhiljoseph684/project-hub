import api from "@/lib/axios";

export const getProjectOverview = async (projectId: string) => {
  try {
    const res = await api.get(
      `/projects/${projectId}/overview`
    );

    return res.data;
  } catch (error) {
    console.error("Failed to fetch project overview:", error);
    throw error;
  }
};