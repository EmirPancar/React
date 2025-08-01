import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    
    addToCart: (state, action) => {
    
      const newItem = action.payload;
      const itemInCart = state.cartItems.find((item) => item.id === newItem.id);

      if (itemInCart) {
        
        itemInCart.quantity += newItem.quantity;
      } else {
        
        state.cartItems.push(newItem);
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },

    incrementQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.quantity++;
      }
    },

    decrementQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          
          state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload);
        }
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
    },

    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;