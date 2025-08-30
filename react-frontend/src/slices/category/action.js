import { createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../api/productApi';
import { 
  createProductCategoryApiAxios, 
  productCategoryListApiAxios, 
  updateProductCategoryApiAxios,
  deleteProductCategoryApiAxios 
} from '../../services/product/productService';

// Create Category
export const createProductCategory = createAsyncThunk(
  productApi.createProductCategoryApi,
  async (productCategoryData, { rejectWithValue }) => {
    try {
      const response = await createProductCategoryApiAxios(productCategoryData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Categories
export const fetchProductCategories = createAsyncThunk(
  productApi.productCategoryListApi,
  async (_, { rejectWithValue }) => {
    try {
      const response = await productCategoryListApiAxios();
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Category
export const updateProductCategory = createAsyncThunk(
  productApi.getUpdateProductCategoryApi,
  async ({ id, name }, { rejectWithValue }) => { // Pass name instead of productCategoryData
    try {
      const response = await updateProductCategoryApiAxios(id, { name });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Category
export const deleteProductCategory = createAsyncThunk(
  productApi.getDeleteProductCategoryApi,
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProductCategoryApiAxios(id);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);
