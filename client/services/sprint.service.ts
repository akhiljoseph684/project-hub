import api from "@/lib/axios";

export interface SprintTask {
  id: string;
  key: string;
  title: string;
  description?: string | null;
  priority?: string;
  type?: string;

  status?: {
    id: string;
    name: string;
  };

  assignee?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
  } | null;

  labels?: any[];

  _count?: {
    comments: number;
    attachments: number;
    checklists: number;
  };
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: string;

  project: {
    id: string;
    name: string;
    key: string;
  };

  tasks?: {
    id: string;
    key: string;
    title: string;
    priority?: string;
    dueDate?: string | null;

    status?: {
      id: string;
      name: string;
      color: string;
    };

    assignee?: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string | null;
    } | null;
  }[];

  _count?: {
    tasks: number;
  };
}

export interface CreateSprintData {
  name: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateSprintData {
  name?: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
}

export const createSprint = async (
  projectId: string,
  data: CreateSprintData,
) => {
  try {
    const res = await api.post(`/sprints/projects/${projectId}`, data);

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

export const getProjectSprints = async (projectId: string) => {
  try {
    const res = await api.get(`/sprints/projects/${projectId}`);

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

export const getSprintById = async (sprintId: string) => {
  try {
    const res = await api.get(`/sprints/${sprintId}`);

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

export const updateSprint = async (
  sprintId: string,
  data: UpdateSprintData,
) => {
  try {
    const res = await api.patch(`/sprints/${sprintId}`, data);

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

export const startSprint = async (sprintId: string) => {
  try {
    const res = await api.post(`/sprints/${sprintId}/start`);

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

export const completeSprint = async (sprintId: string) => {
  try {
    const res = await api.post(`/sprints/${sprintId}/complete`);

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

export const deleteSprint = async (sprintId: string) => {
  try {
    const res = await api.delete(`/sprints/${sprintId}`);

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

export const getMySprints = async () => {
  try {
    const res = await api.get("/sprints/me");

    return res.data.sprints;
  } catch (error: any) {
    console.error("Failed to fetch my sprints:", error);
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};
