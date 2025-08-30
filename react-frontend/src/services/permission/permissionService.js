import axios from 'axios';
import permissionApi from '../../api/permissionApi';

// Create Role function
const createPermissionApiAxios = async ({ role_id, modules }) => {
  console.log("WALI API SERV", role_id, modules);
    
  try {
    // Update the request body to send role_id and modules
    const response = await axios.post(permissionApi.createPermissionApi, {
      role_id,
      modules // modules now contains the array of modules and permissions
    });
    return response; // Return the full response
  } catch (error) {
    console.error("Create Role API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Fetch Product Categories function
const permissionListApiAxios = async () => {
  try {
    const response = await axios.get(permissionApi.permissionListApi); // Correct API endpoint
    return response; // Return the full response
  } catch (error) {
    console.error("Fetch Product Categories API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Update Role function
const updatePermissionApiAxios = async (id, { role_id, modules }) => {
  try {
    const response = await axios.put(`${permissionApi.permissionUpdateApi}/${id}`, {
      role_id, 
      modules // Send updated modules and permissions
    });
    return response; // Return the full response
  } catch (error) {
    console.error("Update Role API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Delete Role function
const deletePermissionApiAxios = async (id) => {
  try {
    const response = await axios.delete(`${permissionApi.permissionDeleteApi}/${id}`);
    return response; // Return the full response
  } catch (error) {
    console.error("Delete Role API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Export all methods
export { 
  createPermissionApiAxios, 
  permissionListApiAxios, 
  updatePermissionApiAxios,
  deletePermissionApiAxios
};
