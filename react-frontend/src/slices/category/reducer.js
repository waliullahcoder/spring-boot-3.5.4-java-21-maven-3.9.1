import { createSlice } from '@reduxjs/toolkit';
import { createProductCategory, fetchProductCategories, updateProductCategory, deleteProductCategory  } from './action';
import { initialCategoryState } from './state';

const defaultErrorMessage = 'An unexpected error occurred. Please try again.';

const categorySlice = createSlice({
  name: 'category',
  initialState: initialCategoryState,
  reducers: {
    resetCategoryState: () => initialCategoryState,
  },
  extraReducers: (builder) => {
    builder
      // Category Create
      .addCase(createProductCategory.pending, (state) => {
        state.status = 'loading';
        state.error = { message: null }; // Reset error
      })
      .addCase(createProductCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.category = action.payload;
        state.categories = Array.isArray(state.categories)
          ? [...state.categories, action.payload]
          : [action.payload];
      })
      .addCase(createProductCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = { message: action.error.message || defaultErrorMessage };
      })
      // Category List
      .addCase(fetchProductCategories.pending, (state) => {
        state.status = 'loading';
        state.error = { message: null }; // Reset error
      })
      .addCase(fetchProductCategories.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.categories = action.payload;
          state.status = 'succeeded';
        } else {
          state.status = 'failed';
          state.categories = [];
          state.error = { message: 'Invalid data received.' };
        }
      })
      .addCase(fetchProductCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = { message: action.error.message || defaultErrorMessage };
      })
      .addCase(updateProductCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Find and update the category
        const updatedCategory = action.payload;
        const index = state.categories.findIndex(category => category.id === updatedCategory.id);
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      })
      
      .addCase(deleteProductCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove the deleted category from the state
        state.categories = state.categories.filter(category => category.id !== action.payload.id);
      });
      
  },
});

export default categorySlice.reducer;
