import api from "@/lib/axios";

export interface ProjectLabel {
  id: string;
  projectId: string;
  name: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLabelPayload {
  name: string;
  color: string;
}

export interface UpdateLabelPayload {
  name?: string;
  color?: string;
}

export async function createLabel(projectId: string, data: CreateLabelPayload) {
  try {
    const res = await api.post(`/labels/projects/${projectId}/labels`, data);

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

export async function getProjectLabels(projectId: string) {
  try {
    const res = await api.get(`/labels/projects/${projectId}/labels`);
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

export async function updateLabel(labelId: string, data: UpdateLabelPayload) {
  try {
    const res = await api.patch(`/labels/${labelId}`, data);

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

export async function deleteLabel(labelId: string) {
  try {
    const res = await api.delete(`/labels/${labelId}`);

    return res.data;
  } catch (error: any) {
    throw(
    error.response?.data || {
      success: false,
      message: "Something went wrong",
    })
  }
}
