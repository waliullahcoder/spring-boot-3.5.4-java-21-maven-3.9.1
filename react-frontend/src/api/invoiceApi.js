// const baseurl = 'http://localhost:8000'; //laravel apis
const baseurl = 'http://localhost:8080'; //java apis

// Define your API endpoints
const createInvoiceApi = `${baseurl}/api/order/create`;
const invoiceListApi = `${baseurl}/api/order/list`;
const getInvoiceShowApi = `${baseurl}/api/order/show`;

// Export as named exports
export { createInvoiceApi, invoiceListApi, getInvoiceShowApi };

// OR export them as a single object
const invoiceApi = {
createInvoiceApi,
invoiceListApi,
getInvoiceShowApi
};

export default invoiceApi; // Default export with all APIs
