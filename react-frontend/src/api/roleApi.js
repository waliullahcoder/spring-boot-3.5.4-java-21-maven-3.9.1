// const baseurl = 'http://localhost:8000'; //laravel apis
const baseurl = 'http://localhost:8080'; //java apis

// Define your API endpoints
const createRoleApi = `${baseurl}/api/role/add`;
const roleListApi = `${baseurl}/api/role/list`;
const roleUpdateApi = `${baseurl}/api/role/update`;
const roleDeleteApi = `${baseurl}/api/role/delete`;

// Export as named exports
export { createRoleApi, roleListApi, roleUpdateApi, roleDeleteApi };

// OR export them as a single object
const roleApi = {
createRoleApi,
roleListApi,
roleUpdateApi,
roleDeleteApi
};


export default roleApi; // Default export with all APIs
