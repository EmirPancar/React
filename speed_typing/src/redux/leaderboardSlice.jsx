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
      
      state.scores.sort((a, b) => {
        if (a.wpm !== b.wpm) {
          return b.wpm - a.wpm;
        }
        return b.accuracy - a.accuracy;
      });
    },
  },
});

export const { toggleLeaderboard, addScore } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;