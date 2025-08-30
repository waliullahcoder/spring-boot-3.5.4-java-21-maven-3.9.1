import { createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../api/productApi';
import { 
  createProductApiAxios, 
  productListApiAxios, 
  updateProductApiAxios,
  deleteProductApiAxios 
} from '../../services/product/productService';

// Create Product
export const createProduct = createAsyncThunk(
  productApi.createProductApi,
  async (ProductData, { rejectWithValue }) => {
    try {
      const response = await createProductApiAxios(ProductData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Products
export const fetchProducts = createAsyncThunk(
  productApi.productListApi,
  async (_, { rejectWithValue }) => {
    try {
      const response = await productListApiAxios();
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  productApi.getUpdateProductApi,
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateProductApiAxios(id, data);
      console.log("WALI ACTION",response);
      
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  productApi.getDeleteProductApi,
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProductApiAxios(id);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);
