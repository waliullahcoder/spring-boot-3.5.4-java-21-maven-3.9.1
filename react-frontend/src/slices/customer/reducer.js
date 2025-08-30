import { createSlice } from '@reduxjs/toolkit';
import { createCustomer, fetchCustomers, updateCustomer, deleteCustomer } from './action';
import { initialCustomerState } from './state';

const customerSlice = createSlice({
  name: 'customer',
  initialState: initialCustomerState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCustomer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customer = action.payload;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updateCustomer = action.payload;
        const index = state.customers.findIndex(category => category.id === updateCustomer.id);
        if (index !== -1) {
        state.customers[index] = updateCustomer;
         }
        })
            
       .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers = state.customers.filter(category => category.id !== action.payload.id);
       });
      
  },
});

export default customerSlice.reducer;
