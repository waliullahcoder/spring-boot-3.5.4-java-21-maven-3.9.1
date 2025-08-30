import axios from 'axios';
import roleApi from '../../api/roleApi';

// Create Role function
const createRoleApiAxios = async ({ user_id, name }) => {
    console.log("WALI API SERV",user_id, name);
    
  try {
    const response = await axios.post(roleApi.createRoleApi, {
      user_id, name
    });
    return response; // Return the full response
  } catch (error) {
    console.error("Create Role API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Fetch Product Categories function
const roleListApiAxios = async () => {
  try {
    const response = await axios.get(roleApi.roleListApi); // Correct API endpoint
    return response; // Return the full response
  } catch (error) {
    console.error("Fetch Product Categories API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Update Role function
const updateRoleApiAxios = async (id, {  user_id, name }) => {
  try {
    const response = await axios.put(`${roleApi.roleUpdateApi}/${id}`, {
        user_id, name
    });
    return response; // Return the full response
  } catch (error) {
    console.error("Update Role API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Delete Role function
const deleteRoleApiAxios = async (id) => {
  try {
    const response = await axios.delete(`${roleApi.roleDeleteApi}/${id}`);
    return response; // Return the full response
  } catch (error) {
    console.error("Delete Role API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Export all methods
export { 
  createRoleApiAxios, 
  roleListApiAxios, 
  updateRoleApiAxios,
  deleteRoleApiAxios
};
