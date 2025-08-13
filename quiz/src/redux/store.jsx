// src/redux/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import quizReducer from '../redux/quizSlice';
import leaderboardReducer from '../redux/leaderboardSlice';
import {
  persistStore,
  persistReducer,
  createMigrate, // Migrasyon için gerekli fonksiyon
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Doğrudan localStorage yerine bunu kullanmak daha güvenli

// 1. Migrasyon mantığını tanımlıyoruz.
const migrations = {
  // Hedef versiyonumuz 1 olsun. Versiyonu olmayan state'i versiyon 1'e taşıyacağız.
  1: async (state) => {
    try {
      // 2. ESKİ anahtardaki veriyi manuel olarak okuyoruz.
      const oldLeaderboardDataString = await storage.getItem('persist:leaderboard');

      // Eğer eski veri yoksa, mevcut state ile devam et.
      if (!oldLeaderboardDataString) {
        return state;
      }

      const oldLeaderboardState = JSON.parse(oldLeaderboardDataString);
      
      // ÖNEMLİ: Sizin localStorage çıktınıza göre 'scores' alanı da string olarak saklanmış.
      // Bu nedenle iki kez parse işlemi yapmamız gerekiyor.
      const scores = JSON.parse(oldLeaderboardState.scores);

      console.log('Migrasyon başarılı: Eski skorlar bulundu ->', scores);

      // 3. Okunan veriyi yeni state yapısına enjekte ediyoruz.
      return {
        ...state,
        leaderboard: {
          ...state.leaderboard,
          scores: scores, // Eski skorları yeni state'in içine yerleştir.
        },
      };
    } catch (error) {
      console.error('Migrasyon sırasında hata:', error);
      return state; // Hata durumunda mevcut state'i koru.
    }
  },
};

const rootReducer = combineReducers({
  quiz: quizReducer,
  leaderboard: leaderboardReducer,
});

const persistConfig = {
  // 4. Yeni anahtarımız 'quiz-leaderboard' olarak kalıyor.
  key: 'quiz-leaderboard',
  storage,
  // 5. Versiyonu ve migrasyon fonksiyonunu yapılandırmaya ekliyoruz.
  version: 1, // Hedef versiyon
  migrate: createMigrate(migrations, { debug: true }), // debug:true konsolda bilgi verir
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