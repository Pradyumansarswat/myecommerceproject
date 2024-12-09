import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
    categoryProducts: [],
    categoryProductsTotalPages: 1,
    categoryProductsCurrentPage: 1,
};

export const getProducts = createAsyncThunk(
    "product/getProducts",
    async ({ page = 1, limit = 10, status = "" }, thunkAPI) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/products?page=${page}&limit=${limit}${
                    status ? `&status=${status}` : ""
                }`
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

export const updateProductStatus = createAsyncThunk(
    "product/updateProductStatus",
    async ({ productId, newStatus, rejectedReason }, thunkAPI) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/products/status/${productId}`, 
                { 
                    status: newStatus,
                    rejectedReason: newStatus === "rejected" ? rejectedReason : ""
                }
            );
            return response.data; 
        } catch (error) {
            console.error("Error updating product status:", error);
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
        }
    }
);

export const getProductsBySellerId = createAsyncThunk(
    "product/getProductsBySellerId",
    async ({ sellerId, page = 1, limit = 10, status = "" }, thunkAPI) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/products/seller/${sellerId}?page=${page}&limit=${limit}${
                    status ? `&status=${status}` : ""
                }`
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);
export const getProductsByStatus = createAsyncThunk(
    "product/getProductsByStatus",
    async ({ status, page = 1, limit = 10 }, thunkAPI) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/products/status/${status}?page=${page}&limit=${limit}`
            );
            return response.data; 
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);
export const getProductsByCategory = createAsyncThunk(
    "product/getProductsByCategory",
    async ({ categoryId, page = 1, limit = 10, status = "" }, thunkAPI) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/products/category/${categoryId}?page=${page}&limit=${limit}${
                    status ? `&status=${status}` : ""
                }`
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        updateProduct: (state, action) => {
            state.products = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = action.payload.products;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || 'An error occurred';
            })
            .addCase(updateProductStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProductStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const updatedProduct = action.payload.product; 
                const index = state.products.findIndex(
                    (product) => product._id === updatedProduct._id
                );
                if (index !== -1) {
                    state.products[index] = updatedProduct; 
                }
            })
            .addCase(updateProductStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || 'An error occurred';
            })
            .addCase(getProductsBySellerId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProductsBySellerId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.sellerProducts = action.payload.products;
                state.sellerProductsTotalPages = action.payload.totalPages;
                state.sellerProductsCurrentPage = action.payload.currentPage;
            })
            .addCase(getProductsBySellerId.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || 'An error occurred';
            })
            .addCase(getProductsByCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProductsByCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.categoryProducts = action.payload.products;
                state.categoryProductsTotalPages = action.payload.totalPages;
                state.categoryProductsCurrentPage = action.payload.currentPage;
            })
            .addCase(getProductsByCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || 'An error occurred';
            })
            .addCase(getProductsByStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProductsByStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = action.payload.products; 
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getProductsByStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || 'An error occurred';
            });
    },
});

export const { updateProduct } = productSlice.actions;
export default productSlice.reducer;
