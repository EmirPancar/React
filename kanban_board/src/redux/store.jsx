import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, createMigrate } from 'redux-persist';
import tasksReducer from './tasksSlice';

const migrations = {
  0: (state) => {
    return state;
  },
  1: (state) => {
    const newTasks = {};
    for (const columnId in state.tasks) {
      newTasks[columnId] = state.tasks[columnId].map(task => {
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
  version: 1, 
  storage,
  migrate: createMigrate(migrations, { debug: true }), 
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