import api from "@/lib/axios";

export const getTaskComments = async (taskId: string) => {
  try {
    const response = await api.get(`/task/${taskId}/comments`);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch task comments:", error);

    throw error;
  }
};

export const createTaskComment = async (taskId: string, content: string) => {
  try {
    const response = await api.post(`/task/${taskId}/comments`, {
      content,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to create task comment:", error);

    throw error;
  }
};

export const deleteTaskComment = async (commentId: string) => {
  try {
    const response = await api.delete(`/task/comments/${commentId}`);

    return response.data;
  } catch (error) {
    console.error("Failed to delete task comment:", error);

    throw error;
  }
};
