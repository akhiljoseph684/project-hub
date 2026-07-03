import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  onlineUsers: Record<string, boolean>;
}

const initialState: SocketState = {
  onlineUsers: {},
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    userOnline: (state, action: PayloadAction<string>) => {
      state.onlineUsers[action.payload] = true;
    },

    userOffline: (state, action: PayloadAction<string>) => {
      delete state.onlineUsers[action.payload];
    },
  },
});

export const { userOnline, userOffline } = socketSlice.actions;

export default socketSlice.reducer;
