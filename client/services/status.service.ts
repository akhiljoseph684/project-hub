import api from "@/lib/axios";

export interface CreateStatusInput {
  name: string;
  color: string;
}

export async function createProjectStatus(
  projectId: string,
  data: CreateStatusInput,
){
  try {
    const res = await api.post(
      `/status/project/${projectId}/`,
      data,
    );

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

export async function deleteProjectStatus(
  statusId: string,
){
  try {
    const res = await api.delete(
      `/status/${statusId}/`
    );

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
