import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { createVendor, fetchVendors, updateVendor } from "../../../slices/vendor/action";
import { useNavigate, useParams } from "react-router-dom";

const VendorForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get vendor ID from URL params
  const { vendors, vendor, status, error  } = useSelector((state) => state.vendor);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    phone_number: "",
    email: "",
    zip_code: "",
  });

  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);
  console.log("Wali2",isEdit,vendors);
  useEffect(() => {
      if (id) {
        setIsEdit(true);
        const vendor = vendors.find((vendor) => vendor.id === parseInt(id));
        console.log("Wali",vendor,vendors);
        
        if (vendor) {
          setFormData({
            first_name: vendor.first_name || '',
            last_name: vendor.last_name || '',
            address: vendor.address || '',
            phone_number: vendor.phone_number || '',
            email: vendor.email || '',
            zip_code: vendor.zip_code || '',
          }); // Set the existing image if available
        }
      }
    }, [id, vendors]);

  useEffect(() => {
    if (id && vendor) {
      setFormData(vendor);
    }
  }, [vendor, id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phone_number) newErrors.phone_number = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.zip_code) newErrors.zip_code = "ZIP Code is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const action = id ? updateVendor({ id, ...formData }) : createVendor(formData);
      dispatch(action).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setSuccessMessage(id ? "Vendor updated successfully!" : "Vendor created successfully!");
        }
      });
    } else {
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        navigate("/admin/vendor/list");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-5 bg-white rounded-md shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {id ? "Edit Vendor" : "Create Vendor"}
      </h2>

      {successMessage && (
        <div className="bg-green-500 text-white text-center py-2 mb-4 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <Input
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={!!errors.first_name}
          className="mb-2"
        />
        {errors.first_name && (
          <p className="text-red-500 text-sm">{errors.first_name}</p>
        )}
        </div>
      <div className="mb-4">
        <Input
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          error={!!errors.last_name}
          className="mb-2"
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm">{errors.last_name}</p>
        )}
      </div>
      <div className="mb-4">
        <Textarea
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={!!errors.address}
          className="mb-2"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
        )}
      </div>
      <div className="mb-4">
        <Input
          label="Phone Number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          error={!!errors.phone_number}
          className="mb-2"
        />
        {errors.phone_number && (
          <p className="text-red-500 text-sm">{errors.phone_number}</p>
        )}
      </div>
      <div className="mb-4">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          className="mb-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
      </div>
      <div className="mb-4">
        <Input
          label="ZIP Code"
          name="zip_code"
          value={formData.zip_code}
          onChange={handleChange}
          error={!!errors.zip_code}
          className="mb-2"
        />
        {errors.zip_code && (
          <p className="text-red-500 text-sm">{errors.zip_code}</p>
        )}
      </div>
      <Button type="submit" color="blue" fullWidth disabled={status === "loading"}>
        {status === "loading" ? "Processing..." : id ? "Update Vendor" : "Save Vendor"}
      </Button>


      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </form>
  );
};

export default VendorForm;
