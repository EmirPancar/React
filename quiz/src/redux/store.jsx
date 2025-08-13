import { configureStore, combineReducers } from '@reduxjs/toolkit';
import quizReducer from '../redux/quizSlice';
import leaderboardReducer from '../redux/leaderboardSlice';
import {
  persistStore,
  persistReducer,
  createMigrate, 
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

const migrations = {
  1: async (state) => {
    try {
      const oldLeaderboardDataString = await storage.getItem('persist:leaderboard');

      if (!oldLeaderboardDataString) {
        return state;
      }

      const oldLeaderboardState = JSON.parse(oldLeaderboardDataString);
      
      const scores = JSON.parse(oldLeaderboardState.scores);

      console.log('Migrasyon başarılı: Eski skorlar bulundu ->', scores);

    
      return {
        ...state,
        leaderboard: {
          ...state.leaderboard,
          scores: scores, 
        },
      };
    } catch (error) {
      console.error('Migrasyon sırasında hata:', error);
      return state; 
    }
  },
};

const rootReducer = combineReducers({
  quiz: quizReducer,
  leaderboard: leaderboardReducer,
});

const persistConfig = {
  key: 'quiz-leaderboard',
  storage,
  version: 1, 
  migrate: createMigrate(migrations, { debug: true }), 
  whitelist: ['leaderboard'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);