import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from '../../api/authApi';
import { registerauthapi } from '../../services/axiosInstance';

export const register = createAsyncThunk(
  apis.registerapi,
  async (formData, { rejectWithValue }) => {
    try {
      const response = await registerauthapi(formData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || "Something went wrong. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
