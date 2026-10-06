import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  avatar: string | null | undefined;
  role: string | undefined;
  email: string | undefined;
  isVerified: boolean | undefined;
  plan: {
    slug: string;
    name: string;
  } | null;
  planId: string | undefined;
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
      const user: User = {
        id:  action.payload.id || state?.user?.id,
        firstName: action.payload.firstName || state?.user?.firstName,
        lastName: action.payload.lastName || state?.user?.lastName,
        avatar: action.payload.avatar || state?.user?.avatar,
        role: action.payload.role || state?.user?.role,
        email: action.payload.email || state?.user?.email,
        isVerified: action.payload.isVerified || state?.user?.isVerified,
        plan: action.payload.plan || null,
        planId: "",
      }
      state.user = user;
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
