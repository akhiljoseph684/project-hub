import api from "@/lib/axios";

export interface CalendarProject {
  id: string;
  name: string;
  key: string;
  startDate: string | null;
  endDate: string | null;
}

export interface CalendarTaskStatus {
  id: string;
  name: string;
}

export interface CalendarTaskSprint {
  id: string;
  name: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
}

export interface CalendarTaskAssignee {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
}

export interface CalendarTask {
  id: string;
  key: string;
  title: string;
  description?: string | null;
  dueDate: string | null;
  priority?: string;
  type?: string;

  status?: CalendarTaskStatus | null;

  sprint?: CalendarTaskSprint | null;

  assignee?: CalendarTaskAssignee | null;
}

export interface CalendarSprint {
  id: string;
  name: string;
  goal?: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
}

export interface ProjectCalendar {
  project: CalendarProject;
  tasks: CalendarTask[];
  sprints: CalendarSprint[];
}

export const getProjectCalendar = async (
  projectId: string,
): Promise<ProjectCalendar> => {
  try {
    const res = await api.get(`/calendar/projects/${projectId}`);

    return res.data.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to load project calendar",
      }
    );
  }
};
