import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input,Typography,CardHeader } from '@material-tailwind/react'; // Import Material Tailwind components
import { createProduct, updateProduct } from '../../../slices/product/action';
import { fetchProductCategories } from "../../../slices/category/action";
import Select from 'react-select';
const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { products } = useSelector((state) => state.product);
  const { categories, status, error } = useSelector((state) => state.category);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    code: '',
    category_id: '',
    quantity: '',
    sale_price: '',
    purchase_price: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // New image preview
  const [existingImage, setExistingImage] = useState(null); // Existing image for edit mode

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (!formData.code) newErrors.code = "Code is required";
    if (!formData.category_id) newErrors.category_id = "Category ID is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.sale_price) newErrors.sale_price = "Sale price is required";
    if (!formData.purchase_price) newErrors.purchase_price = "Purchase price is required";
    return newErrors;
  };

  useEffect(() => {
    dispatch(fetchProductCategories());
  }, [dispatch]);



  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const product = products.find((product) => product.id === parseInt(id));
      if (product) {
        setFormData({
          name: product.name || '',
          model: product.model || '',
          code: product.code || '',
          category_id: product.category_id || '',
          quantity: product.quantity || '',
          sale_price: product.sale_price || '',
          purchase_price: product.purchase_price || '',
          image: null,
        });
        setExistingImage(product.image || null); // Set the existing image if available
      }
    }
  }, [id, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file)); // Set preview URL
        setFormData((prevState) => ({
          ...prevState,
          image: file,
        }));
      } else {
        alert('Please select a valid image file'); // Validate file type
      }
    }
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, value || '');
        }
      });

    if (isEdit) {
        dispatch(updateProduct({ id, data: form })).then(() => {
          setSuccessMessage("Product updated successfully!");
        });
      } else {
        dispatch(createProduct(form)).then(() => {
          setSuccessMessage("Product created successfully!");
        });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        navigate('/admin/product/list');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, navigate]);

  return (
    <div className="w-full max-w-lg mx-auto p-5 bg-white rounded-md shadow-lg">
      {successMessage && (
        <div className="bg-green-500 text-white text-center py-2 mb-4 rounded-md">
          {successMessage}
        </div>
      )}

       <CardHeader variant="gradient" color="blue-gray" className="mb-8 p-6">
                <div className="flex justify-between items-center">
                  <Typography variant="h6" color="white">
                  {id ? 'Edit Product' : 'Create Product'}
                  </Typography>
                </div>
              </CardHeader>

      <div className="mb-4">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          className="mb-2"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}
      </div>

      <div className="mb-4">
        <Input
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          error={!!errors.model}
          className="mb-2"
        />
        {errors.model && (
          <p className="text-red-500 text-sm">{errors.model}</p>
        )}
      </div>

      <div className="mb-4">
        <Input
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          error={!!errors.code}
          className="mb-2"
        />
        {errors.code && (
          <p className="text-red-500 text-sm">{errors.code}</p>
        )}
      </div>

      <div className="mb-4">
        {categories && categories.length > 0 ? (
          <Select
            placeholder="Select Category"
            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
            value={categories
              .map((cat) => ({ value: cat.id, label: cat.name }))
              .find((option) => option.value === formData.category_id) || null}
            onChange={(selectedOption) =>
              setFormData((prevState) => ({ ...prevState, category_id: selectedOption.value }))
            }
          />
        ) : status === 'loading' ? (
          <p>Loading categories...</p>
        ) : (
          <p className="text-red-500">
            Failed to load categories: {error?.message || "An unknown error occurred"}
          </p>
        )}
      </div>


      <div className="mb-4">
        <Input
          label="Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          error={!!errors.quantity}
          className="mb-2"
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm">{errors.quantity}</p>
        )}
      </div>

      <div className="mb-4">
        <Input
          label="Sale Price"
          name="sale_price"
          value={formData.sale_price}
          onChange={handleChange}
          error={!!errors.sale_price}
          className="mb-2"
        />
        {errors.sale_price && (
          <p className="text-red-500 text-sm">{errors.sale_price}</p>
        )}
      </div>

      <div className="mb-4">
        <Input
          label="Purchase Price"
          name="purchase_price"
          value={formData.purchase_price}
          onChange={handleChange}
          error={!!errors.purchase_price}
          className="mb-2"
        />
        {errors.purchase_price && (
          <p className="text-red-500 text-sm">{errors.purchase_price}</p>
        )}
      </div>

      <div className="mb-4">
        <Input
          type="file"
          label="Upload Image"
          onChange={handleFileChange}
          className="mb-2"
        />
        <div className="mt-4">
          {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
            ) : existingImage ? (
              <img src={`http://localhost:5000${existingImage}`} alt="Existing" className="w-32 h-32 object-cover rounded" />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
              <span>No Image</span>
            </div>
          )}
        </div>
      </div>

          <Button className="mt-4" onClick={handleSubmit}>
            {isEdit ? 'Update Product' : 'Create Product'}
      </Button>
    </div>
  );
};

export default CreateProduct;
