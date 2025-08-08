import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import leaderboardReducer from './leaderboardSlice';
import gameReducer from './gameSlice';

const persistConfig = {
  key: 'hizli-yazma-leaderboard',
  storage,
  whitelist: ['leaderboard'],
};

const rootReducer = combineReducers({
  leaderboard: leaderboardReducer,
  game: gameReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);