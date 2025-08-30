// const baseurl = 'http://localhost:8000'; //laravel apis
const baseurl = 'http://localhost:8080'; //java apis

// Define your API endpoints
const createPermissionApi = `${baseurl}/api/permission/add`;
const permissionListApi = `${baseurl}/api/permission/list`;
const permissionUpdateApi = `${baseurl}/api/permission/update`;
const permissionDeleteApi = `${baseurl}/api/permission/delete`;

// Export as named exports
export { createPermissionApi, permissionListApi, permissionUpdateApi, permissionDeleteApi };

// OR export them as a single object
const permissionApi = {
createPermissionApi,
permissionListApi,
permissionUpdateApi,
permissionDeleteApi
};


export default permissionApi; // Default export with all APIs
