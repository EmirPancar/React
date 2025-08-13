import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  center: [35, 39],
  zoom: 1,
  selectedCity: null,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenterAndZoom: (state, action) => {
      state.center = action.payload.coordinates;
      state.zoom = action.payload.zoom;
      state.selectedCity = action.payload;
    },
    resetMap: (state) => {
      state.center = initialState.center;
      state.zoom = initialState.zoom;
      state.selectedCity = null;
    },
  },
});

export const { setCenterAndZoom, resetMap } = mapSlice.actions;

export default mapSlice.reducer;