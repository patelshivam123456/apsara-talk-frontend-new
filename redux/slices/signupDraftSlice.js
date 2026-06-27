import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  password: "",
};

const signupDraftSlice = createSlice({
  name: "signupDraft",
  initialState,
  reducers: {
    saveSignupDraft: (state, action) => {
      state.username = action.payload?.username || "";
      state.password = action.payload?.password || "";
    },
    clearSignupDraft: () => initialState,
  },
});

export const { saveSignupDraft, clearSignupDraft } = signupDraftSlice.actions;

export default signupDraftSlice.reducer;
