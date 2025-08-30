// const baseurl = 'http://localhost:8000'; //laravel apis
const baseurl = 'http://localhost:8080'; //java apis

// Define your API endpoints
const createVendorApi = `${baseurl}/api/vendor/add`;
const vendorListApi = `${baseurl}/api/vendor/list`;
const vendorUpdateApi = `${baseurl}/api/vendor/update`;
const vendorDeleteApi = `${baseurl}/api/vendor/delete`;

// Export as named exports
export { createVendorApi, vendorListApi };

// OR export them as a single object
const vendorApi = {
createVendorApi,
vendorListApi,
vendorUpdateApi,
vendorDeleteApi
};

export default vendorApi; // Default export with all APIs
