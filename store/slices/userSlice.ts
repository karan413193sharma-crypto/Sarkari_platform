import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Qualification } from "@/types/exam";

interface UserState {
  qualification: Qualification | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  qualification: null,
  isLoggedIn: false,
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
  },
});

export const { setQualification, setLoggedIn } = userSlice.actions;
export default userSlice.reducer;
