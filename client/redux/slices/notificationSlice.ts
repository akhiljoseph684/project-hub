import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  invitationCount: number;
}

const initialState: NotificationState = {
  invitationCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setInvitationCount: (state, action: PayloadAction<number>) => {
      state.invitationCount = action.payload;
    },

    incrementInvitationCount: (state) => {
      state.invitationCount += 1;
    },

    decrementInvitationCount: (state) => {
      if (state.invitationCount > 0) {
        state.invitationCount -= 1;
      }
    },

    resetInvitationCount: (state) => {
      state.invitationCount = 0;
    },
  },
});

export const {
  setInvitationCount,
  incrementInvitationCount,
  decrementInvitationCount,
  resetInvitationCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
