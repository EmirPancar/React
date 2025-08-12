import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage'ı kullanır
import habitsReducer from './habitsSlice'; // './habitsSlice.js' dosyasından import ediyoruz

// Eğer ileride başka reducer'lar eklenirse diye combineReducers kullanmak iyi bir pratiktir.
const rootReducer = combineReducers({
  habits: habitsReducer,
  // user: userReducer, (örnek)
});

const persistConfig = {
  key: 'root', // localStorage'da verinin saklanacağı anahtar
  storage,
  // whitelist: ['habits'] // Sadece 'habits' slice'ını kalıcı yap gibi seçenekler de var
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // persist yapılandırılmasıyla sarmalanmış reducer'ı kullan
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux Persist eylemleri (PERSIST, REHYDRATE vb.) serileştirilemeyen değerler içerir.
      // Bu kontrolü kapatarak konsoldaki uyarıları engelliyoruz.
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);