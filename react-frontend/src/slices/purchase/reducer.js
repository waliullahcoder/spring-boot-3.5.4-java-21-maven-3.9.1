import { createSlice } from '@reduxjs/toolkit';
import { initialPurchaseState } from './state';
import * as actions from './action';
import { fetchPurchases, purchaseShow } from './action';

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState: initialPurchaseState,
  reducers: {
    setVendor: actions.setVendor,
    fetchPurchases: actions.fetchPurchases,
    purchaseShow: actions.purchaseShow,
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
     .addCase(fetchPurchases.pending, (state) => {
           state.status = 'loading';
         })
         .addCase(fetchPurchases.fulfilled, (state, action) => {
           state.status = 'succeeded';
           state.purchaseOrders = action.payload;
         })
         .addCase(fetchPurchases.rejected, (state, action) => {
           state.status = 'failed';
           state.error = action.payload;
         })
         
         .addCase(purchaseShow.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(purchaseShow.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.purchase = action.payload;
        })
        .addCase(purchaseShow.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
  },
});

export const {
  setVendor,
  addProduct,
  removeProduct,
  updateQuantity,
  setDiscount,
  setTax,
  setSelectedProduct,
  setQuantity,
} = purchaseSlice.actions; // Export actions

export default purchaseSlice.reducer; // Export reducer
