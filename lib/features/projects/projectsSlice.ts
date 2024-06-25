import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  url?: string | null;
}

const initialState = [] as ProjectState[] | null;

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: {
      reducer: (state, action: PayloadAction<ProjectState[] | null>) => {
        return action.payload;
      },
      prepare: (projects: ProjectState[] | null) => {
        return { payload: projects };
      },
    },
  },
});

export const { setProjects } = projectSlice.actions;
export default projectSlice.reducer;
