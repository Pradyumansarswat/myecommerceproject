import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
  import { jwtDecode } from "jwt-decode"; 
import Cookies from 'js-cookie';

const adminLogin = createAsyncThunk("admin/login", async (data, thunkAPI) => {
  const response = await axios.post(
    "http://localhost:5000/api/admin/login",
    data
  );
  return response.data;
});

const adminUpdateDetails = createAsyncThunk(
  "admin/updateDetails",
  async (updateData, { rejectWithValue }) => {
    try {
      const { id, ...updates } = updateData;
      const response = await axios.put(`http://localhost:5000/api/admin/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const forgotPassword = createAsyncThunk(
  "admin/forgot-password",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/forgot-password",
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const verifyForgotPasswordOTP = createAsyncThunk(
  "admin/verify-forgot-password-otp",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/verify-forgot-password-otp",
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const resetPassword = createAsyncThunk(
  "admin/reset-password",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/reset-password",
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const getAdminFromToken = createAsyncThunk(
  "admin/getFromToken",
  async (_, thunkAPI) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('JWT token not found in cookies');
      }

      console.log("Token retrieved from cookies:", token); 
      
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken); 
      
      if (!decodedToken.userId) {
        throw new Error('User ID not found in token');
      }
      
      const response = await axios.get(`http://localhost:5000/api/admin/${decodedToken.userId}`);
      console.log("Admin details fetched:", response.data); 
      
      return { user: response.data, token };
    } catch (error) {
      console.error("Error fetching admin details:", error); 
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const fetchAdminDetails = createAsyncThunk(
  "admin/fetchDetails",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const updateProfilePic = createAsyncThunk(
  "admin/updateProfilePic",
  async (formData, thunkAPI) => {
    try {
      const token = Cookies.get('token'); 
      if (!token) {
        throw new Error('No token found in cookies');
      }
      const response = await axios.post(
        "http://localhost:5000/api/admin/update-profile-pic",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in updateProfilePic:', error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const completeSignup = createAsyncThunk(
  "admin/completeSignup",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/signup-verify",
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  token: null,
  user: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    updateAdminDetails: (state, action) => {
      state.user = action.payload.user;
    },
    logoutAdmin: (state) => {
      state.token = null;
      state.user = null;
      Cookies.remove('token'); 
    },
    setForgotPasswordAdmin: (state, action) => {
      state.user = action.payload.user;
    },
    resetPasswordAdmin: (state, action) => {
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(adminLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(adminLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.token = action.payload.token;
      state.user = action.payload.admin;
      Cookies.set('token', action.payload.token, { expires: 7, path: '/' }); 
      console.log('Token set in cookie:', action.payload.token); 
    });
    builder.addCase(adminLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    builder.addCase(adminUpdateDetails.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(adminUpdateDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(adminUpdateDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    builder.addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = action.payload.message;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    builder.addCase(verifyForgotPasswordOTP.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(verifyForgotPasswordOTP.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = action.payload.message;
      state.tempToken = action.payload.tempToken;
    });
    builder.addCase(verifyForgotPasswordOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = action.payload.message;
      state.tempToken = null;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    builder.addCase(getAdminFromToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAdminFromToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(getAdminFromToken.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    builder.addCase(fetchAdminDetails.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAdminDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = { ...state.user, ...action.payload };
    });
    builder.addCase(fetchAdminDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    builder.addCase(updateProfilePic.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user.profilePic = action.payload.profilePic;
    });
  },
});

export const {
  setAdmin,
  logoutAdmin,
  updateAdminDetails,
  setForgotPasswordAdmin,
  resetPasswordAdmin,
} = adminSlice.actions;
export {
  adminLogin,
  adminUpdateDetails,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  getAdminFromToken,
  fetchAdminDetails,
  updateProfilePic,
  completeSignup,
};
export default adminSlice.reducer;
