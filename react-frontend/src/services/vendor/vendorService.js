import axios from 'axios';
import vendorApi from '../../api/vendorApi';

// Create Vendor function
const createVendorApiAxios = async ({ first_name, last_name, address, email, phone_number, zip_code }) => {
  try {
    const response = await axios.post(vendorApi.createVendorApi, {
        first_name, last_name, address, email, phone_number, zip_code
    });
    return response; // Return the full response
  } catch (error) {
    console.error("Create Vendor API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};


// Create Vendor function
const vendorListApiAxios = async () => {
    try {
      const response = await axios.get(vendorApi.vendorListApi); // Correct API endpoint
      return response; // Return the full response
    } catch (error) {
      console.error("list Vendor API Error:", error.message);
      throw error; // Rethrow the error for handling in calling code
    }
  };

  const updateVendorApiAxios = async (id, vendorData) => {
    try {
      const response = await axios.put(`${vendorApi.vendorUpdateApi}/${id}`, vendorData);
      return response;
    } catch (error) {
      console.error("Update Vendor API Error:", error.message);
      throw error;
    }
  };
  
  // Delete Vendor function
  const deleteVendorApiAxios = async (id) => {
    try {
      const response = await axios.delete(`${vendorApi.vendorDeleteApi}/${id}`);
      return response;
    } catch (error) {
      console.error("Delete Vendor API Error:", error.message);
      throw error;
    }
  };
  
  
  // Export all methods
  export { createVendorApiAxios, vendorListApiAxios, updateVendorApiAxios, deleteVendorApiAxios };
