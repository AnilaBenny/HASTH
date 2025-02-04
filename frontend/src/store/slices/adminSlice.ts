import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Admin {
  id: string;
  name: string;
  email: string;
}

interface AdminState {
  admin: Admin | null;
  isAuthenticated: boolean;
}

const initialState: AdminState = {
  admin: null,
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("admin", JSON.stringify(action.payload));
      localStorage.setItem("isAuthenticated", "true");
    },
    clearAdmin: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      localStorage.removeItem("admin");
      localStorage.removeItem("isAuthenticated");
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;

export const selectAdmin = (state: { admin: AdminState }) => state.admin.admin;
export const selectIsAdminAuthenticated = (state: { admin: AdminState }) => state.admin.isAuthenticated;

export default adminSlice.reducer;
export type { AdminState };
