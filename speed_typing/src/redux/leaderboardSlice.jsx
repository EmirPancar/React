import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMenuOpen: false,
  scores: [], 
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    toggleLeaderboard: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    addScore: (state, action) => {
      state.scores.push(action.payload);
      state.scores.sort((a, b) => b.wpm - a.wpm);
    },
  },
});

export const { toggleLeaderboard, addScore } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;