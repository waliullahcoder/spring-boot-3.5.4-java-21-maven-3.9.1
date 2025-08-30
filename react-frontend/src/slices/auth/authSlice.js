import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from "../../api/authApi";
import { userListApiAxios } from "../../services/axiosInstance";
// Initialize the initial state with token and isSuperAdmin from localStorage

// Async thunk for fetching user list
export const fetchUserList = createAsyncThunk(
  apis.userlistapi,
  async (_, { rejectWithValue }) => {
    try {
      const response = await userListApiAxios();
      console.log("API Response:", response.data); // Debugging API response
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong. Please try again.");
    }
  }
);
const initialState = {
  users: [],
  user: localStorage.getItem("user") || null,
  token: localStorage.getItem("token") || null,
  isSuperAdmin: JSON.parse(localStorage.getItem("isSuperAdmin")) || false,
};

// Create a slice of the state to manage authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isSuperAdmin = action.payload.isSuperAdmin;
      localStorage.setItem("user", action.payload.user);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("isSuperAdmin", JSON.stringify(action.payload.isSuperAdmin));
    },
    logout: (state) => {
      state.token = null;
      state.isSuperAdmin = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isSuperAdmin");
    },
  },

  extraReducers: (builder) => {
      builder
        .addCase(fetchUserList.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchUserList.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.users = Array.isArray(action.payload) ? action.payload : []; // Ensuring users is an array
          console.log("Updated Redux Store Users:", state.users); // Debugging state update
        })
        
        .addCase(fetchUserList.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        });
    },


});

// Export actions and reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
