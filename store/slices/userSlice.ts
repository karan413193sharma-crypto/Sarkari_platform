import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Qualification } from "@/types/exam";

interface UserState {
  qualification: Qualification | null;
  isLoggedIn: boolean;
  email: string | null;
  hasProfile: boolean;
}

const initialState: UserState = {
  qualification: null,
  isLoggedIn: false,
  email: null,
  hasProfile: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setQualification(state, action: PayloadAction<Qualification>) {
      state.qualification = action.payload;
    },
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setSession(
      state,
      action: PayloadAction<{ isLoggedIn: boolean; email: string | null }>
    ) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.email = action.payload.email;
      if (!action.payload.isLoggedIn) {
        state.hasProfile = false;
      }
    },
    setHasProfile(state, action: PayloadAction<boolean>) {
      state.hasProfile = action.payload;
    },
  },
});

export const { setQualification, setLoggedIn, setSession, setHasProfile } = userSlice.actions;
export default userSlice.reducer;