// const baseurl = 'http://localhost:8000'; //laravel apis
const baseurl = 'http://localhost:8080'; //java apis

// Define your API endpoints
const createPurchaseApi = `${baseurl}/api/purchase/order/create`;
const purchaseListApi = `${baseurl}/api/purchase/order/list`;
const getPurchaseShowApi = `${baseurl}/api/purchase/order/show`;

// Export as named exports
export { createPurchaseApi, purchaseListApi, getPurchaseShowApi };

// OR export them as a single object
const purchaseApi = {
createPurchaseApi,
purchaseListApi,
getPurchaseShowApi
};

export default purchaseApi; // Default export with all APIs
