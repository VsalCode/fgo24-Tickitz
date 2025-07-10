import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  credentials:{}
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authActions: (state, action) => {
      state.credentials = action.payload;
    }
  }
});

export const { authActions } = auth.actions;
export default auth.reducer;