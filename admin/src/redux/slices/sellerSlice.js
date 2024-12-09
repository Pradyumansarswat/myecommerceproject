import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  sellers: [],
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getSellers = createAsyncThunk(
  "seller/getSellers",
  async ({ page = 1, limit = 10, status = "" }, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/sellers?page=${page}&limit=${limit}${
          status ? `&status=${status}` : ""
        }`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const updateSellerStatus = createAsyncThunk(
  "seller/updateSellerStatus",
  async ({ sellerId, newStatus }, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/sellers/${sellerId}`,
        {
          status: newStatus,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const getSellerByStatus = createAsyncThunk(
  "seller/getSellerByStatus",
  async (status, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/sellers?status=${status}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

export const getSellerById = createAsyncThunk(
  "seller/getSellerById",
  async (sellerId, thunkAPI) => {
    try {
      console.log("Fetching seller with ID:", sellerId);
      const response = await axios.get(`http://localhost:5000/api/sellers/${sellerId}`);
      console.log("Seller data received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching seller:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSellers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sellers = action.payload.sellers;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getSellers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'An error occurred';
      })
      .addCase(updateSellerStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedSeller = action.payload;
        const index = state.sellers.findIndex(
          (seller) => seller._id === updatedSeller._id
        );
        if (index !== -1) {
          state.sellers[index] = updatedSeller;
        }
      })
      .addCase(updateSellerStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'An error occurred';
      })
      .addCase(getSellerByStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sellers = action.payload;
      })
      .addCase(getSellerByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'An error occurred';
      })
      .addCase(getSellerById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentSeller = action.payload;
      })
      .addCase(getSellerById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "An error occurred";
      });
  },
});

export default sellerSlice.reducer;
