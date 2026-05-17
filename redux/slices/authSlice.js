import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          isLoggedIn: true,
          user: action.payload,
        })
      );

      // Cookie lets getServerSideProps read auth state on the server
      document.cookie = "isLoggedIn=1; path=/; max-age=604800; SameSite=Lax";
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;

      localStorage.removeItem("auth");

      document.cookie = "isLoggedIn=; path=/; max-age=0; SameSite=Lax";
    },

    restoreAuth: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
    },
  },
});

export const { login, logout, restoreAuth } =
  authSlice.actions;

export default authSlice.reducer;