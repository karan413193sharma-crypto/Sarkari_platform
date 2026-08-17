import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthMode = "login" | "signup";

interface UiState {
  authModalOpen: boolean;
  authMode: AuthMode;
}

const initialState: UiState = {
  authModalOpen: false,
  authMode: "login",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAuthModal(state, action: PayloadAction<AuthMode>) {
      state.authModalOpen = true;
      state.authMode = action.payload;
    },
    closeAuthModal(state) {
      state.authModalOpen = false;
    },
    setAuthMode(state, action: PayloadAction<AuthMode>) {
      state.authMode = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, setAuthMode } = uiSlice.actions;
export default uiSlice.reducer;