import { createSlice } from '@reduxjs/toolkit';
import { initialInvoiceState } from './state';
import * as actions from './action';
import { fetchInvoices, invoiceShow } from './action';

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: initialInvoiceState,
  reducers: {
    setCustomer: actions.setCustomer,
    fetchInvoices: actions.fetchInvoices,
    invoiceShow: actions.invoiceShow,
    addProduct: actions.addProduct,
    removeProduct: actions.removeProduct,
    updateQuantity: actions.updateQuantity,
    setDiscount: actions.setDiscount,
    setTax: actions.setTax,
    setSelectedProduct: actions.setSelectedProduct,
    setQuantity: actions.setQuantity,
  },
  extraReducers: (builder) => {
    builder
     .addCase(fetchInvoices.pending, (state) => {
           state.status = 'loading';
         })
         .addCase(fetchInvoices.fulfilled, (state, action) => {
           state.status = 'succeeded';
           state.orders = action.payload;
         })
         .addCase(fetchInvoices.rejected, (state, action) => {
           state.status = 'failed';
           state.error = action.payload;
         })
         
         .addCase(invoiceShow.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(invoiceShow.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.invoice = action.payload;
        })
        .addCase(invoiceShow.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
  },
});

export const {
  setCustomer,
  addProduct,
  removeProduct,
  updateQuantity,
  setDiscount,
  setTax,
  setSelectedProduct,
  setQuantity,
} = invoiceSlice.actions; // Export actions

export default invoiceSlice.reducer; // Export reducer
