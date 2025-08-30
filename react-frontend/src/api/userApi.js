// const baseurl = 'http://localhost:8000'; //laravel apis
const baseurl = 'http://localhost:8080'; //java apis

// Define your API endpoints
const createCustomerApi = `${baseurl}/api/customer/add`;
const customerListApi = `${baseurl}/api/customer/list`;
const customerUpdateApi = `${baseurl}/api/customer/update`;
const customerDeleteApi = `${baseurl}/api/customer/delete`;

// Export as named exports
export { createCustomerApi, customerListApi };

// OR export them as a single object
const userApi = {
createCustomerApi,
customerListApi,
customerUpdateApi,
customerDeleteApi
};

export default userApi; // Default export with all APIs
