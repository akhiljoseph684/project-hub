import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  isVerified: boolean;
  plan: {
    slug: string;
    name: string;
  } | null;
  planId: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setAuth, logout, setLoading, updateAccessToken, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
