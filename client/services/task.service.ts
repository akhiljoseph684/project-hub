import api from "@/lib/axios";

export const createTask = async (projectId: string, payload: any) => {
  try {
    const res = await api.post(`/task/${projectId}/`, payload);

    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export async function updateTaskStatus(
  projectId: any,
  taskId: string,
  statusId: string,
) {
  try {
    const res = await api.patch(`/task/${projectId}/${taskId}/status`, {
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

export async function getTasksByProject(projectId: string) {
  try {
    const res = await api.get(`/task/projects/${projectId}`);

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

export async function uploadTaskAttachment(taskId: string, file: File) {
  try {
    const formData = new FormData();

    formData.append("file", file);

    const res = await api.post(`/task/${taskId}/attachments`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

export async function deleteTaskAttachment(attachmentId: string) {
  try {
    const res = await api.delete(`task/attachments/${attachmentId}`);

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

export async function getTaskById(taskId: string) {
  try {
    const res = await api.get(`/task/${taskId}`);

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

export const assignTaskToSprint = async (
  projectId: string,
  taskId: string,
  sprintId: string,
) => {
  try {
    const res = await api.patch(`/task/${projectId}/${taskId}/sprint`, {
      sprintId,
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
};

export const removeTaskFromSprint = async (
  projectId: string,
  taskId: string,
) => {
  try {
    const res = await api.delete(`/tasks/${projectId}/${taskId}/sprint`);

    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export async function getBacklogTasks(projectId: string) {
  try {
    const res = await api.get(`/task/projects/${projectId}/backlog`);

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
