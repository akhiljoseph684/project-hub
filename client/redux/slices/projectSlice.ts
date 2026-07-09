import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  id: string;
  name: string;
  slug: string;
  key: string;
  description?: string;
  color: string;
  icon?: string;
  type: "SCRUM" | "KANBAN";
  visibility: "PRIVATE" | "PUBLIC";
}

interface ProjectState {
  currentProject: Project | null;
}

const initialState: ProjectState = {
  currentProject: null,
};

const projectSlice = createSlice({
  name: "project",

  initialState,

  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },

    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
});

export const { setCurrentProject, clearCurrentProject } = projectSlice.actions;

export default projectSlice.reducer;
