import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

import catalogReducer from './catalogSlice';
import cartReducer from './cartSlice';


const persistConfig = {
  key: 'lumina', 
  storage, 
  whitelist: ['cart'] 
};


const rootReducer = combineReducers({
  catalog: catalogReducer,
  cart: cartReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER', 'persist/FLUSH'],
      },
    }),
});


export const persistor = persistStore(store);