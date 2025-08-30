import axios from 'axios';
import productApi from '../../api/productApi';

// Create Product Category function
const createProductCategoryApiAxios = async ({ name }) => {
  try {
    const response = await axios.post(productApi.createProductCategoryApi, {
      name
    });
    return response; // Return the full response
  } catch (error) {
    console.error("Create Product Category API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Fetch Product Categories function
const productCategoryListApiAxios = async () => {
  try {
    const response = await axios.get(productApi.productCategoryListApi); // Correct API endpoint
    return response; // Return the full response
  } catch (error) {
    console.error("Fetch Product Categories API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Update Product Category function
const updateProductCategoryApiAxios = async (id, { name }) => {
  try {
    const response = await axios.put(`${productApi.getUpdateProductCategoryApi}/${id}`, {
      name
    });
    return response; // Return the full response
  } catch (error) {
    console.error("Update Product Category API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Delete Product Category function
const deleteProductCategoryApiAxios = async (id) => {
  try {
    const response = await axios.delete(`${productApi.getDeleteProductCategoryApi}/${id}`);
    return response; // Return the full response
  } catch (error) {
    console.error("Delete Product Category API Error:", error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Create Product function
const createProductApiAxios = async (product) => {
  try {
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      formData.append(key, value || '');
    });
//console.log("CREATE P",formData,product);

    const response = await axios.post(productApi.createProductApi, product, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('Create Product API Response:', response.data);
    return response;
  } catch (error) {
    console.error('Create Product API Error:', error.message, error.response?.data);
    throw error;
  }
};



// Update Product Product function
const updateProductApiAxios = async (id, product) => {
  try {
    console.log("Product data received:", product);

    // Convert FormData back to a plain object
    const productObj = {};
    for (let [key, value] of product.entries()) {
      productObj[key] = value;
    }
    console.log("Extracted product object:", productObj);

    // Normalize the extracted object
    const normalizedProduct = {
      id: id || productObj.id || null,
      name: productObj.name || null,
      model: productObj.model || null,
      code: productObj.code || null,
      category_id: productObj.category_id || null,
      quantity: productObj.quantity || null,
      sale_price: productObj.sale_price || null,
      purchase_price: productObj.purchase_price || null,
      image: productObj.image || null,
      created_at: productObj.created_at || null,
    };

    console.log("Normalized product object:", normalizedProduct);

    const formData = new FormData();
    Object.entries(normalizedProduct).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    console.log("FormData contents:",formData);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log("Wali FormData contents:",formData);
    const response = await axios.put(`${productApi.getUpdateProductApi}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Product updated successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Update Product API Error:", error.message, error.response?.data);

    if (error.response) {
      console.error("API Response Data:", error.response.data);
      console.error("API Response Status:", error.response.status);
      console.error("API Response Headers:", error.response.headers);
    }

    throw error;
  }
};










// Fetch Product Categories function
const productListApiAxios = async () => {
  try {
    const response = await axios.get(productApi.productListApi); // Correct API endpoint
    console.log("WALI PROD service",response);
    
    return response; // Return the full response
  } catch (error) {
    console.error('Fetch Product Categories API Error:', error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};


// Delete Product Product function
const deleteProductApiAxios = async (id) => {
  try {
    const response = await axios.delete(`${productApi.getDeleteProductApi}/${id}`);
    return response; // Return the full response
  } catch (error) {
    console.error('Delete Product Product API Error:', error.message);
    throw error; // Rethrow the error for handling in calling code
  }
};

// Export all methods
export { 
  createProductCategoryApiAxios, 
  productCategoryListApiAxios, 
  updateProductCategoryApiAxios,
  deleteProductCategoryApiAxios,
  createProductApiAxios, 
  productListApiAxios, 
  updateProductApiAxios,
  deleteProductApiAxios 
};
