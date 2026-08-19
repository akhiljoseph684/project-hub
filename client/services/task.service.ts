import api from "@/lib/axios";

export const createTask = async (projectId: string, payload: any) => {
  try {
    const res = await api.post(`/task/${projectId}/`, payload);

    return res.data;
  } catch (error: any) {
    console.log(error);
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export async function updateTaskStatus(taskId: string, statusId: string) {
  try {
    const res = await api.patch(`/task/${taskId}/status`, {
      statusId,
    });

    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
}
