import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import socketReducer from "./slices/socketSlice"
import projectReducer from "./slices/projectSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
