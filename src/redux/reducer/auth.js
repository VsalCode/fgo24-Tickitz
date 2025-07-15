import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token:""
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authActions: (state, action) => {
      state.token = action.payload;
    }
  }
});

export const { authActions } = auth.actions;
export default auth.reducer;