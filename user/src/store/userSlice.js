import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import Cookies from 'js-cookie';


export const fetchWishlistItems = createAsyncThunk('user/fetchWishlistItems', async (_, thunkAPI) => {
  const token = Cookies.get("token");
  if (!token) return thunkAPI.rejectWithValue('No token found');
  
  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    const response = await axios.get(`http://localhost:5000/api/wishlist/${userId}`, { withCredentials: true });
    return response.data.products.length;  
  } catch (error) {
    console.error("Failed to fetch wishlist items:", error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchCartItems = createAsyncThunk('user/fetchCartItems', async (_, thunkAPI) => {
  const token = Cookies.get("token");
  if (!token) return thunkAPI.rejectWithValue('No token found');
  
  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    const response = await axios.get(`http://localhost:5000/api/cart/${userId}`, { withCredentials: true });
    return response.data.products.length;  
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    return thunkAPI.rejectWithValue(error.message);
  }
});


const userSlice = createSlice({
  name: 'user',
  initialState: {
    wishlistCount: 0,
    cartCount: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
   
    resetUserData: (state) => {
      state.wishlistCount = 0;
      state.cartCount = 0;
    },
    resetCartCount: (state) => {
      state.cartCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.wishlistCount = action.payload;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartCount = action.payload;
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetUserData, resetCartCount } = userSlice.actions;


export const selectWishlistCount = (state) => state.user.wishlistCount;
export const selectCartCount = (state) => state.user.cartCount;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
