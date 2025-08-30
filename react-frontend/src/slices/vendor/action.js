import { createAsyncThunk } from '@reduxjs/toolkit';
import vendorApi from '../../api/vendorApi';
import { createVendorApiAxios, vendorListApiAxios, updateVendorApiAxios, deleteVendorApiAxios  } from '../../services/vendor/vendorService';

//Create
export const createVendor = createAsyncThunk(
  vendorApi.createVendorApi,
  async (vendorData, { rejectWithValue }) => {
    try {
      const response = await createVendorApiAxios(vendorData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

//List
export const fetchVendors = createAsyncThunk(
  vendorApi.vendorListApi,
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorListApiAxios();
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);


//Update
export const updateVendor = createAsyncThunk(
  vendorApi.vendorUpdateApi,
  async ({ id, ...vendorData }, { rejectWithValue }) => {
    try {
      const response = await updateVendorApiAxios(id, vendorData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Failed to update vendor. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

//Delete
export const deleteVendor = createAsyncThunk(
  vendorApi.vendorDeleteApi,
  async (id, { rejectWithValue }) => {
    try {
      await deleteVendorApiAxios(id);
      return id; // Return deleted vendor ID for state update
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Failed to delete vendor. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

