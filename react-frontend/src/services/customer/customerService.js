import axios from 'axios';
import userApi from '../../api/userApi';

// Create Customer function
const createCustomerApiAxios = async ({ first_name, last_name, address, email, phone_number, zip_code }) => {
  try {
    const response = await axios.post(userApi.createCustomerApi, {
        first_name, last_name, address, email, phone_number, zip_code
    });
    return response; // Return the full response
  } catch (error) {
    console.error("Create Customer API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};


// Create Customer function
const customerListApiAxios = async () => {
    try {
      const response = await axios.get(userApi.customerListApi); // Correct API endpoint
      return response; // Return the full response
    } catch (error) {
      console.error("list Customer API Error:", error.message);
      throw error; // Rethrow the error for handling in calling code
    }
  };

  const updateCustomerApiAxios = async (id, customerData) => {
    try {
      const response = await axios.put(`${userApi.customerUpdateApi}/${id}`, customerData);
      return response;
    } catch (error) {
      console.error("Update Customer API Error:", error.message);
      throw error;
    }
  };
  
  // Delete Customer function
  const deleteCustomerApiAxios = async (id) => {
    try {
      const response = await axios.delete(`${userApi.customerDeleteApi}/${id}`);
      return response;
    } catch (error) {
      console.error("Delete Customer API Error:", error.message);
      throw error;
    }
  };
  
  
  // Export all methods
  export { createCustomerApiAxios, customerListApiAxios, updateCustomerApiAxios, deleteCustomerApiAxios };
