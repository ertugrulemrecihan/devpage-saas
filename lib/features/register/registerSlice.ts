import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface RegisterState {
  username?: string;
}

const initialState = {} as RegisterState;

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setUsername: {
      reducer(state, action: PayloadAction<string>) {
        state.username = action.payload;
      },
      prepare(username: string) {
        return { payload: username };
      },
    },
    getUsername(state): {
      username: string;
    } {
      return { username: state.username as string };
    },
    clearUsername(state) {
      state.username = '';
    },
  },
});

export const { setUsername, clearUsername } = registerSlice.actions;
export default registerSlice.reducer;
