import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode"; 

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      const expirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
      state.user = action.payload;
      state.isAuthenticated = true;
      console.log(JSON.stringify(action.payload),'store');
      
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("tokenExpiration", expirationTime.toString());
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token"); 
      localStorage.removeItem("tokenExpiration");
    },
    initializeUser: (state) => {
      const token = localStorage.getItem("token");
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      
      if (token && tokenExpiration) {
        try {
          const decodedUser = jwtDecode<User>(token);
          const currentTime = Date.now();
          
          if (currentTime > parseInt(tokenExpiration)) {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiration");
          } else {
            state.user = decodedUser;
            state.isAuthenticated = true;
          }
        } catch (error) {
          console.error("Invalid token", error);
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
        }
      }
    },
  },
});

export const { setUser, clearUser, initializeUser } = userSlice.actions;

export const selectUser = (state: any) => state.user.user;
export const selectIsUserAuthenticated = (state: any) => state.user.isAuthenticated;

export default userSlice.reducer;
export type { UserState };
