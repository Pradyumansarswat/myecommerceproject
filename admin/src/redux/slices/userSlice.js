import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async ({ page = 1, limit = 10, status = "" }, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "user/updateUserStatus",
  async ({ userId, newStatus }, thunkAPI) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, {
        status: newStatus,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getUserByStatus = createAsyncThunk(
  "user/getUserByStatus",
  async (status, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users?status=${status}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalUsers = action.payload.totalUsers;
      })    
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedUser = action.payload;
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserByStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })    
      .addCase(getUserByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default userSlice.reducer;
