import { createSlice} from "@reduxjs/toolkit";

const initialState = {
  tempHistoryBooking: []
}

const ticket = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    bookTicketActions: (state, action) => {
      const existingIndex = state.tempHistoryBooking.findIndex(
        booking => booking.idTransaction === action.payload.idTransaction
      );
      
      if (existingIndex === -1) {
        state.tempHistoryBooking.push(action.payload);
      } else {
        state.tempHistoryBooking[existingIndex] = action.payload;
      }
    },
  },
})

export const { bookTicketActions } = ticket.actions
export default ticket.reducer