import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; 

export const createProduct = createAsyncThunk(
  "sellerProduct/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };

      const response = await axios.post(`${API_URL}/products`, productData, config);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error.response?.data); 
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "sellerProduct/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      return response.data.product; 
    } catch (error) {
      console.error("Error fetching product by ID:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const fetchProductsBySellerIdAndStatus = createAsyncThunk(
  "sellerProduct/fetchProductsBySellerIdAndStatus",
  async ({ sellerId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/seller/${sellerId}/status?status=${status}`);
      return response.data.products; 
    } catch (error) {
      console.error("Error fetching products by seller ID and status:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const fetchProductsBySellerIdAndCategory = createAsyncThunk(
  "sellerProduct/fetchProductsBySellerIdAndCategory",
  async ({ sellerId, categoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/seller/${sellerId}/category/${categoryId}`);
      return response.data.products; 
    } catch (error) {
      console.error("Error fetching products by seller ID and category:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const fetchProductsBySellerId = createAsyncThunk(
  "sellerProduct/fetchProductsBySellerId",
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/seller/${sellerId}`);
      return response.data.products; 
    } catch (error) {
      console.error("Error fetching products by seller ID:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  "sellerProduct/deleteProductImage",
  async ({ productId, imageName }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/products/${productId}/images/${imageName}`);
      return response.data; 
    } catch (error) {
      console.error("Error deleting product image:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const updateProduct = createAsyncThunk(
  "sellerProduct/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/products/${productId}`, productData);
      return response.data; 
    } catch (error) {
      console.error("Error updating product:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const updateProductImages = createAsyncThunk(
  "sellerProduct/updateProductImages",
  async ({ productId, images }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/products/${productId}/images`, { images });
      return response.data; 
    } catch (error) {
      console.error("Error updating product images:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const updateVariantImages = createAsyncThunk(
  "sellerProduct/updateVariantImages",
  async ({ productId, variantImages }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/products/${productId}/variants`, { variantImages });
      return response.data; 
    } catch (error) {
      console.error("Error updating variant images:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const updateProductStock = createAsyncThunk(
  "sellerProduct/updateProductStock",
  async ({ productId, stock }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/products/${productId}/stock`, { stock });
      return response.data; 
    } catch (error) {
      console.error("Error updating product stock:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const fetchAllProductsBySellerId = createAsyncThunk(
  "sellerProduct/fetchAllProductsBySellerId",
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/seller/${sellerId}`);
      console.log(response.data.products);
      return response.data.products; 
    } catch (error) {
      console.error("Error fetching all products by seller ID:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const fetchProductsByStatus = createAsyncThunk(
  "sellerProduct/fetchProductsByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/status/${status}`);
      return response.data.products; 
    } catch (error) {
      console.error("Error fetching products by status:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "sellerProduct/fetchProductsByCategory",
  async ({ sellerId, categoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/seller/${sellerId}/category/${categoryId}`);
      return response.data.products; 
    } catch (error) {
      console.error("Error fetching products by category:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'An error occurred' });
    }
  }
);

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState: {
    products: [],
    selectedProduct: null, 
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.unshift(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      // Handle the new fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedProduct = action.payload; // Store the fetched product
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(fetchProductsBySellerIdAndStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsBySellerIdAndStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload; 
      })
      .addCase(fetchProductsBySellerIdAndStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(fetchProductsBySellerIdAndCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsBySellerIdAndCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload; 
      })
      .addCase(fetchProductsBySellerIdAndCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(fetchProductsBySellerId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsBySellerId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload; 
      })
      .addCase(fetchProductsBySellerId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(deleteProductImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(fetchAllProductsBySellerId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload; 
      })
      .addCase(fetchProductsByStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload; 
      })
      .addCase(fetchProductsByStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload; 
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export default sellerProductSlice.reducer;
