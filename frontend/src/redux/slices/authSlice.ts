import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    email: string;
    role: string;
  } | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ email: string; role: string }>
    ) => {
      state.user = action.payload;

      //Optional: store role in localStorage
      localStorage.setItem("role", action.payload.role.toLowerCase());
    },
    logout: (state) => {
      state.user = null;

      //Optional:remove from localStorage
      localStorage.removeItem("role");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
