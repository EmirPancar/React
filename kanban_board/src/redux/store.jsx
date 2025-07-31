import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, createMigrate } from 'redux-persist';
import tasksReducer from './tasksSlice';

// YENİ: Veri geçişini yönetecek olan migrations objesi
const migrations = {
  0: (state) => {
    // Bu, state'in ilk versiyonu olduğu için boş bırakılabilir.
    return state;
  },
  1: (state) => {
    // Bu, bizim yeni versiyonumuz. Eski state'i alıp düzeltecek.
    // tasks objesindeki her bir görevi kontrol et
    const newTasks = {};
    for (const columnId in state.tasks) {
      newTasks[columnId] = state.tasks[columnId].map(task => {
        // Eğer assignee bir string ise (eski yapı) ve boş değilse,
        // onu bir diziye dönüştür. Zaten bir diziyse, dokunma.
        if (typeof task.assignee === 'string' && task.assignee) {
          return {
            ...task,
            assignee: [task.assignee],
          };
        }
        return task;
      });
    }
    return {
      ...state,
      tasks: newTasks,
    };
  },
};

const persistConfig = {
  key: 'root',
  version: 1, // YENİ: State versiyonunu belirtiyoruz. Eskiden 0'dı, şimdi 1 oldu.
  storage,
  migrate: createMigrate(migrations, { debug: true }), // YENİ: migrate fonksiyonunu ekliyoruz.
};

const persistedReducer = persistReducer(persistConfig, tasksReducer);

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