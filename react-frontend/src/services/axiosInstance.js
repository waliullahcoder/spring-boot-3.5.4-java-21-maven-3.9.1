import axios from 'axios';
import apis from '../api/authApi';

// Function to log in
const loginauthapi = async (email, password) => {
  try {
    const response = await axios.post(apis.loginapi, { email, password });
    return response; // Return the response data
  } catch (error) {
    console.error("Login API Error:", error);
    throw error; // Rethrow the error to handle it where the function is called
  }
};
// Register function

const registerauthapi = async ({ first_name, last_name, email, phone_number, zip_code, is_superadmin, password }) => {
  try {
    const password="password";
    const response = await axios.post(apis.registerapi, {
      first_name, last_name, email, phone_number, zip_code, is_superadmin, password
    });
    return response; // Return the full response
  } catch (error) {
    console.error("Register API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};


//User list
const userListApiAxios = async () => {
  try {
    const response = await axios.get(apis.userlistapi); // Correct API endpoint
    return response; // Return the full response
  } catch (error) {
    console.error("list User API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};
  
  // Logout function
  const logoutauthapi = async (token) => {
    try {
      const response = await axios.post(
        apis.logoutapi,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response; // Return the full response
    } catch (error) {
      console.error("Logout API Error:", error);
      throw error;
    }
  };
  
  // Export all methods
  export { loginauthapi, registerauthapi, logoutauthapi, userListApiAxios };
