import { UserWithUserPage } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState = {} as UserWithUserPage | undefined;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: {
      reducer: (state, action: PayloadAction<UserWithUserPage | undefined>) => {
        return action.payload;
      },
      prepare: (projects: UserWithUserPage | undefined) => {
        return { payload: projects };
      },
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
