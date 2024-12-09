import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data.categories; 
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload; 
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch categories";
      });
  },
});

export default categorySlice.reducer;
