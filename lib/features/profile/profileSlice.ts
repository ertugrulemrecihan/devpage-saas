import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  isEditMode: boolean;
}

const initialState = {} as ProfileState;

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setEditingMode: {
      reducer(state, action: PayloadAction<boolean>) {
        state.isEditMode = action.payload;
      },
      prepare(isEditMode: boolean) {
        return { payload: isEditMode };
      },
    },
  },
});

export const { setEditingMode } = profileSlice.actions;
export default profileSlice.reducer;
