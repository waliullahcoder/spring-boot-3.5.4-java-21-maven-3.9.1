import axios from 'axios';
import purchaseApi from '../../api/purchaseApi';

// Create Purchase function
const createPurchaseApiAxios = async (purchaseData) => {
  try {
    const response = await axios.post(purchaseApi.createPurchaseApi, purchaseData);
    return response; // Return the full response
  } catch (error) {
    console.error('Create Purchase API Error:', error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Fetch Purchase List function
const purchaseListApiAxios = async () => {
  try {
    const response = await axios.get(purchaseApi.purchaseListApi);
    return response; // Return the full response
  } catch (error) {
    console.error('Fetch Purchase List API Error:', error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Delete Product Category function
const purchaseShowApiAxios = async (id) => {
  try {
    const response = await axios.get(`${purchaseApi.getPurchaseShowApi}/${id}`);
    return response; // Return the full response
  } catch (error) {
    console.error("Purchase Details API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Export all methods
export {
  createPurchaseApiAxios,
  purchaseListApiAxios,
  purchaseShowApiAxios
};
