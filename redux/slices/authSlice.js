import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  accessToken: null,
  isAuthLoaded: false,
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
      state.accessToken = action.payload.accessToken || null;
      state.isAuthLoaded = true;
    },

    // =========================
    // UPDATE PROFILE NAME
    // =========================
    updateProfileName: (
      state,
      action
    ) => {
      const firstName = action.payload.firstName;
      const lastName = action.payload.lastName;

      if (state.user) {
        if (firstName) {
          state.user.firstName = firstName;
        }

        if (lastName) {
          state.user.lastName = lastName;
        }
      }

    },

    // =========================
    // LOGOUT
    // =========================
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.accessToken = null;
      state.isAuthLoaded = true;
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

      if (
        action.payload &&
        Object.prototype.hasOwnProperty.call(action.payload, "accessToken")
      ) {
        state.accessToken = action.payload.accessToken || null;
      }
    },

    setAccessToken: (state, action) => {
      state.accessToken =
        typeof action.payload === "object"
          ? action.payload?.accessToken || null
          : action.payload || null;
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
  setAccessToken,
  setAuthLoading,
  updateProfileName,
} = authSlice.actions;

export default authSlice.reducer;
