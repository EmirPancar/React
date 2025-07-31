import { createSlice } from '@reduxjs/toolkit';

const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState: {
        scores: []
    },
    reducers: {
        addScore: (state, action) => {
            state.scores.push(action.payload);
            state.scores.sort((a, b) => b.score - a.score);
        }
    }
});

export const { addScore } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;