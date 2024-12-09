import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const initiateSignup = createAsyncThunk(
  "seller/initiateSignup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/sellers/initiate-signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Unknown error occurred" });
    }
  }
);

export const completeSignup = createAsyncThunk(
  "seller/completeSignup",
  async ({ sellerId, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/sellers/complete-signup`, { sellerId, otp });
      
      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 7 }); // Store for 7 days
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Unknown error occurred" });
    }
  }
);

export const loginSeller = createAsyncThunk(
  "seller/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/sellers/login`, credentials);
      console.log(response)
      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 50 }); // Store token in cookie for 50 days
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSellers = createAsyncThunk(
  "seller/getSellers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/sellers`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSellerById = createAsyncThunk(
  "seller/getSellerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/sellers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSeller = createAsyncThunk(
  "seller/updateSeller",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/sellers/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSeller = createAsyncThunk(
  "seller/deleteSeller",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/sellers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "seller/forgotPassword",
  async (emailOrPhone, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/sellers/forgot-password`, { emailOrPhone });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyForgotPasswordOTP = createAsyncThunk(
  "seller/verifyForgotPasswordOTP",
  async ({ emailOrPhone, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/sellers/verify-forgot-password-otp`, { emailOrPhone, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "seller/resetPassword",
  async ({ newPassword, tempToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/sellers/reset-password`, { newPassword, tempToken });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProfilePic = createAsyncThunk(
  "seller/updateProfilePic",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().seller;
      if (!token) {
        throw new Error('No token found');
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.post(`${API_URL}/sellers/update-profile-pic`, formData, config);
      return response.data;
    } catch (error) {
      console.error('Error updating profile pic:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { error: error.message || "Unknown error occurred" });
    }
  }
);

export const updateSellerDetails = createAsyncThunk(
  "seller/updateSellerDetails",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/sellers/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    seller: null,
    token: Cookies.get('token') || null, 
    sellers: [],
    status: 'idle',
    error: null,
    tempToken: null,
    signupStatus: 'idle',
    signupData: null,
  },
  reducers: {
    logout: (state) => {
      state.seller = null;
      state.token = null;
      Cookies.remove('token'); 
    },
    clearSignupStatus: (state) => {
      state.signupStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateSignup.pending, (state) => {
        state.signupStatus = 'loading';
      })
      .addCase(initiateSignup.fulfilled, (state, action) => {
        state.signupStatus = 'otpSent';
        state.signupData = { sellerId: action.payload.sellerId };
      })
      .addCase(initiateSignup.rejected, (state, action) => {
        state.signupStatus = 'failed';
        state.error = action.payload?.error || 'An error occurred during signup initiation';
      })
      .addCase(completeSignup.pending, (state) => {
        state.signupStatus = 'loading';
      })
      .addCase(completeSignup.fulfilled, (state, action) => {
        state.signupStatus = 'succeeded';
        state.seller = action.payload.seller;
        state.token = action.payload.token;
        state.signupData = null;
      })
      .addCase(completeSignup.rejected, (state, action) => {
        state.signupStatus = 'failed';
        state.error = action.payload?.error || 'An error occurred during signup completion';
      })
      .addCase(loginSeller.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.seller = action.payload.seller;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginSeller.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.error || 'Login failed';
      })
      .addCase(getSellers.fulfilled, (state, action) => {
        state.sellers = action.payload.sellers;
      })
      .addCase(getSellerById.fulfilled, (state, action) => {
        state.seller = action.payload;
      })
      .addCase(updateSeller.fulfilled, (state, action) => {
        state.seller = action.payload;
      })
      .addCase(deleteSeller.fulfilled, (state, action) => {
        state.seller = null;
        state.token = null;
      })
      .addCase(verifyForgotPasswordOTP.fulfilled, (state, action) => {
        state.tempToken = action.payload.tempToken;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.tempToken = null;
      })
      .addCase(updateProfilePic.fulfilled, (state, action) => {
        state.seller.profilePic = action.payload.profilePic;
      })
      .addCase(updateSellerDetails.fulfilled, (state, action) => {
        state.seller = action.payload;
      });
  },
});

export const { logout, clearSignupStatus } = sellerSlice.actions;
export default sellerSlice.reducer;
