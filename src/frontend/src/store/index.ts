import { configureStore } from '@reduxjs/toolkit';
import blocksReducer from './slices/blocksSlice';

export const store = configureStore({
  reducer: {
    blocks: blocksReducer,
  },
});

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;