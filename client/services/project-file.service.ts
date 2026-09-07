import api from "@/lib/axios";

export const getProjectFiles = async (projectId: string) => {
  try {
    const response = await api.get(`/projects/${projectId}/files`);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch project files:", error);

    throw error;
  }
};

export const deleteProjectFile = async (fileId: string) => {
  try {
    const response = await api.delete(`/projects/files/${fileId}`);

    return response.data;
  } catch (error) {
    console.error("Failed to delete project file:", error);

    throw error;
  }
};
