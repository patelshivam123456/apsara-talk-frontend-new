import { configureStore } from "@reduxjs/toolkit";
import authReducer   from "./slices/authSlice";
import signupDraftReducer from "./slices/signupDraftSlice";
import walletReducer from "./slices/walletSlice";

export const store = configureStore({
  reducer: {
    auth:   authReducer,
    signupDraft: signupDraftReducer,
    wallet: walletReducer,
  },
});
