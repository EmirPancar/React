import { configureStore } from '@reduxjs/toolkit';
import leaderboardReducer from './leaderboardSlice';
import gameReducer from './gameSlice';


export const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});