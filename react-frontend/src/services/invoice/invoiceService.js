import axios from 'axios';
import invoiceApi from '../../api/invoiceApi';

// Create Invoice function
const createInvoiceApiAxios = async (invoiceData) => {
  try {
    const response = await axios.post(invoiceApi.createInvoiceApi, invoiceData);
    return response; // Return the full response
  } catch (error) {
    console.error('Create Invoice API Error:', error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Fetch Invoice List function
const invoiceListApiAxios = async () => {
  try {
    const response = await axios.get(invoiceApi.invoiceListApi);
    return response; // Return the full response
  } catch (error) {
    console.error('Fetch Invoice List API Error:', error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Delete Product Category function
const invoiceShowApiAxios = async (id) => {
  try {
    const response = await axios.get(`${invoiceApi.getInvoiceShowApi}/${id}`);
    return response; // Return the full response
  } catch (error) {
    console.error("Invoice Details API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Export all methods
export {
  createInvoiceApiAxios,
  invoiceListApiAxios,
  invoiceShowApiAxios
};
