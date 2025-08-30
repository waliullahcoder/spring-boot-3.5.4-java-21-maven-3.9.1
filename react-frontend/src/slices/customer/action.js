import { createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';
import { createCustomerApiAxios, customerListApiAxios, updateCustomerApiAxios, deleteCustomerApiAxios  } from '../../services/customer/customerService';

//Create
export const createCustomer = createAsyncThunk(
  userApi.createCustomerApi,
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await createCustomerApiAxios(customerData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

//List
export const fetchCustomers = createAsyncThunk(
  userApi.customerListApi,
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerListApiAxios();
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);


//Update
export const updateCustomer = createAsyncThunk(
  userApi.customerUpdateApi,
  async ({ id, ...customerData }, { rejectWithValue }) => {
    try {
      const response = await updateCustomerApiAxios(id, customerData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Failed to update customer. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

//Delete
export const deleteCustomer = createAsyncThunk(
  userApi.customerDeleteApi,
  async (id, { rejectWithValue }) => {
    try {
      await deleteCustomerApiAxios(id);
      return id; // Return deleted customer ID for state update
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Failed to delete customer. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

