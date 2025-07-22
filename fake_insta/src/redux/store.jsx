import { configureStore } from '@reduxjs/toolkit';
import catalogReducer from './catalogSlice';
import cartReducer from './cartSlice'; 

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    cart: cartReducer, 
  },
});