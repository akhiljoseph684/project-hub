import api from "@/lib/axios";

export const searchUsers = async (search: string) => {
  try {
    const response = await api.get("/projects/search-users?search=" + search);

    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const createProject = async (data: FormData) => {
  try {
    const response = await api.post("/projects", data);

    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const getProjects = async (
  page: number,
  limit: number,
  search: string = "",
) => {
  try {
    const response = await api.get("/projects", {
      params: {
        page,
        limit,
        search,
      },
    });

    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const getProjectBySlug = async (slug: string | null) => {
  try {
    const response = await api.get(`/projects/${slug}`);

    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const updateProject = async (id: string, data: any) => {
  try {
    const response = await api.patch(`/projects/${id}`, data);

    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const deleteProject = async (id: string) => {
  try {
    const response = await api.delete(`/projects/${id}`);

    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const inviteMembers = async (
  projectId: string,
  members: {
    userId: string;
    role: "ADMIN" | "MEMBER" | "VIEWER";
  }[],
) => {
  try {
    const response = await api.post(`/projects/${projectId}/members`, {
      members,
    });

    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const getProjectRoles = async (projectId: string) => {
  try {
    const res = await api.get(`/projects/${projectId}/roles`);

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

export const createProjectRole = async (
  projectId: string | null,
  payload: {
    name: string;
    description?: string;
    color?: string;
    permissions: Record<string, boolean>;
  },
) => {
  try {
    const res = await api.post(`/projects/${projectId}/roles`, payload);

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

export const updateProjectRole = async (
  roleId: string,
  payload: {
    name: string;
    description?: string;
    color?: string;
    permissions: Record<string, boolean>;
  },
) => {
  try {
    const res = await api.patch(
      `/projects/roles/${roleId}`,
      payload,
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
};

export const deleteProjectRole = async (roleId: string) => {
  try {
    const res = await api.delete(`/projects/roles/${roleId}`);

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
