// Define the base URL
const baseurl = 'http://localhost:5000'; // Node APIs

// Define your API endpoints with placeholders for dynamic parameters
const createProductCategoryApi = `${baseurl}/api/product/category/add`;
const productCategoryListApi = `${baseurl}/api/product/category/list`;
const getUpdateProductCategoryApi = `${baseurl}/api/product/category/update`;
const getDeleteProductCategoryApi = `${baseurl}/api/product/category/delete`;


//Product
const createProductApi = `${baseurl}/api/product/add`;
const productListApi = `${baseurl}/api/product/list`;
const getUpdateProductApi = `${baseurl}/api/product/update`;
const getDeleteProductApi = `${baseurl}/api/product/delete`;
// Export API endpoints with dynamic methods
export { 
  createProductCategoryApi, 
  productCategoryListApi, 
  getUpdateProductCategoryApi, 
  getDeleteProductCategoryApi,

  createProductApi, 
  productListApi, 
  getUpdateProductApi, 
  getDeleteProductApi

};

// OR export them as a single object
const productApi = {
  createProductCategoryApi,
  productCategoryListApi,
  getUpdateProductCategoryApi,
  getDeleteProductCategoryApi,
  createProductApi, 
  productListApi, 
  getUpdateProductApi, 
  getDeleteProductApi
};

export default productApi; // Default export with all APIs
