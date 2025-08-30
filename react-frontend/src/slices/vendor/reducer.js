import { createSlice } from '@reduxjs/toolkit';
import { createVendor, fetchVendors, updateVendor, deleteVendor } from './action';
import { initialVendorState } from './state';

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: initialVendorState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVendor.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vendor = action.payload;
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchVendors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updateVendor = action.payload;
        const index = state.vendors.findIndex(category => category.id === updateVendor.id);
        if (index !== -1) {
        state.vendors[index] = updateVendor;
         }
        })
            
       .addCase(deleteVendor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vendors = state.vendors.filter(category => category.id !== action.payload.id);
       });
      
  },
});

export default vendorSlice.reducer;
