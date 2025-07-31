import { configureStore, combineReducers } from '@reduxjs/toolkit';
import quizReducer from '../redux/quizSlice';
import leaderboardReducer from '../redux/leaderboardSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

const persistConfig = {
  key: 'leaderboard',
  storage,
  whitelist: ['scores'] 
};

const rootReducer = combineReducers({
  quiz: quizReducer,
  leaderboard: persistReducer(persistConfig, leaderboardReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);