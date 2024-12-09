import { configureStore } from '@reduxjs/toolkit';
import wishlistSlice from './userSlice';

export const store = configureStore({
  reducer: {
    user: wishlistSlice,
  },
});
