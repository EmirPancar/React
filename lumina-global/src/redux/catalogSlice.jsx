import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 

export const fetchProducts = createAsyncThunk(
  'catalog/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await axios.get('https://fakestoreapi.com/products');

      return response.data;
    } catch (error) {

      if (error.response) {
       
        return rejectWithValue(error.response.data);
      } else {
       
        return rejectWithValue(error.message);
      }
    }
  }
);

const initialState = {
  products: [],
  categories: [],
  selectedCategory: 'All',
  selectedProduct: null,
  status: 'idle',
  error: null,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null; 
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
        const uniqueCategories = [...new Set(action.payload.map(item => item.category))];
        state.categories = ['All', ...uniqueCategories];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setCategory, setSelectedProduct } = catalogSlice.actions;

export default catalogSlice.reducer;