import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type SeatSelection = {
  eventId: number | null;
  selectedSeatIds: number[];
  reservationId?: string;
  expiresAt?: number;
};

const initialState: SeatSelection = {
  eventId: null,
  selectedSeatIds: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    selectSeat(state, action: PayloadAction<number>) {
      if (!state.selectedSeatIds.includes(action.payload)) {
        state.selectedSeatIds.push(action.payload);
      }
    },
    deselectSeat(state, action: PayloadAction<number>) {
      state.selectedSeatIds = state.selectedSeatIds.filter(id => id !== action.payload);
    },
    setEvent(state, action: PayloadAction<number | null>) {
      state.eventId = action.payload;
      state.selectedSeatIds = [];
      state.reservationId = undefined;
      state.expiresAt = undefined;
    },
    setReservation(state, action: PayloadAction<{reservationId: string; expiresAt: number}>) {
      state.reservationId = action.payload.reservationId;
      state.expiresAt = action.payload.expiresAt;
    },
    clearReservation(state) {
      state.reservationId = undefined;
      state.expiresAt = undefined;
      state.selectedSeatIds = [];
    },
  },
});

export const {selectSeat, deselectSeat, setEvent, setReservation, clearReservation} = bookingSlice.actions;
export default bookingSlice.reducer;

