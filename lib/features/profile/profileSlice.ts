import { UserForProfile } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  isEditMode: boolean;
  user: UserForProfile | undefined;
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
    setProfileUser: {
      reducer(state, action: PayloadAction<UserForProfile>) {
        state.user = action.payload;
      },
      prepare(user: UserForProfile) {
        return { payload: user };
      },
    },
  },
});

export const { setEditingMode, setProfileUser } = profileSlice.actions;
export default profileSlice.reducer;
