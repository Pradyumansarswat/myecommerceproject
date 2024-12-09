import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; 

export const createVariant = createAsyncThunk(
  "variant/createVariant",
  async (variantData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/variants`, variantData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

const variantSlice = createSlice({
  name: "variant",
  initialState: {
    variants: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVariant.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createVariant.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.variants.push(action.payload.variant);
      })
      .addCase(createVariant.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export default variantSlice.reducer;
