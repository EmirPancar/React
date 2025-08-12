import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import habitsReducer from './habitsSlice';

const persistConfig = {
  key: 'Habits-Persist',
  storage,
};

const persistedReducer = persistReducer(persistConfig, habitsReducer);

export const store = configureStore({
  reducer: {
    habits: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);