import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user:{}
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    currentUserActions: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const { currentUserActions } = user.actions;
export default user.reducer;