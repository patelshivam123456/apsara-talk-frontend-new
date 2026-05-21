import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
  isAuthLoaded: false, // only becomes true AFTER restoreAuth runs
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // =========================
    // LOGIN
    // =========================
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthLoaded = true;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          isLoggedIn: true,
          user: action.payload.user,
          token: action.payload.token,
        })
      );

      document.cookie =
        "isLoggedIn=1; path=/; max-age=604800; SameSite=Lax";

      document.cookie = `token=${action.payload.token}; path=/; max-age=604800; SameSite=Lax`;
    },

    // =========================
    // UPDATE PROFILE NAME
    // =========================
    updateProfileName: (
      state,
      action
    ) => {
      if (state.user) {
        state.user.firstName =
          action.payload.firstName || "";

        state.user.lastName =
          action.payload.lastName || "";
      }

      // update localStorage also
      const authData = JSON.parse(
        localStorage.getItem("auth") ||
          "{}"
      );

      if (authData.user) {
        authData.user.firstName =
          action.payload.firstName || "";

        authData.user.lastName =
          action.payload.lastName || "";

        localStorage.setItem(
          "auth",
          JSON.stringify(authData)
        );
      }
    },

    // =========================
    // LOGOUT
    // =========================
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.isAuthLoaded = true;

      localStorage.removeItem("auth");

      document.cookie =
        "isLoggedIn=; path=/; max-age=0; SameSite=Lax";

      document.cookie =
        "token=; path=/; max-age=0; SameSite=Lax";
    },

    // =========================
    // RESTORE AUTH
    // =========================
    restoreAuth: (state, action) => {
      state.isAuthLoaded = true;

      state.isLoggedIn =
        !!action.payload?.isLoggedIn;

      state.user =
        action.payload?.user || null;

      state.token =
        action.payload?.token || null;
    },

    // =========================
    // AUTH LOADING
    // =========================
    setAuthLoading: (state) => {
      state.isAuthLoaded = false;
    },
  },
});

export const {
  login,
  logout,
  restoreAuth,
  setAuthLoading,
  updateProfileName,
} = authSlice.actions;

export default authSlice.reducer;