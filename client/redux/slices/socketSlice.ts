import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  onlineUsers: Record<string, string>;
}

const initialState: SocketState = {
  onlineUsers: {},
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setOnlineUsers: (
      state,
      action: PayloadAction<Record<string, string>>,
    ) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = socketSlice.actions;

export default socketSlice.reducer;