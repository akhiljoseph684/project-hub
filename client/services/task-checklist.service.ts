import api from "@/lib/axios";

export interface TaskChecklist {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateChecklistPayload {
  title: string;
  position: number;
}

export interface UpdateChecklistPayload {
  title?: string;
  isCompleted?: boolean;
  position?: number;
}

export const getChecklists = async (taskId: string) => {
  try {
    const response = await api.get(`/task/${taskId}/checklists`);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch checklists:", error);
    throw error;
  }
};

export const createChecklist = async (
  taskId: string,
  payload: CreateChecklistPayload,
) => {
  try {
    const response = await api.post(`/task/${taskId}/checklists`, payload);

    return response.data;
  } catch (error) {
    console.error("Failed to create checklist:", error);
    throw error;
  }
};

export const updateChecklist = async (checklistId: string) => {
  try {
    const response = await api.patch(`/task/checklists/${checklistId}`);

    return response.data;
  } catch (error) {
    console.error("Failed to update checklist:", error);
    throw error;
  }
};

export const deleteChecklist = async (checklistId: string) => {
  try {
    const response = await api.delete(`/task/checklists/${checklistId}`);

    return response.data;
  } catch (error) {
    console.error("Failed to delete checklist:", error);
    throw error;
  }
};
