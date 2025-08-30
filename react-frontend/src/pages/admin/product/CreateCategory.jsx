import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Typography, CardHeader, Input } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { createProductCategory, updateProductCategory } from "../../../slices/category/action"; // Import actions

const CreateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get category ID from URL for edit
  const { categories, error } = useSelector((state) => state.category);

  const [categoryName, setCategoryName] = useState(""); // State for category name
  const [isEdit, setIsEdit] = useState(false); // Flag to check if it's edit or create
  const [successMessage, setSuccessMessage] = useState(""); // Success message for operations

  // Check if it's an edit operation
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const category = categories.find((category) => category.id === parseInt(id));
      if (category) {
        setCategoryName(category.name);
      } else {
        // Handle category not found or other error cases
        console.error("Category not found for editing");
      }
    }
  }, [id, categories]);

  const handleSubmit = () => {
    if (isEdit) {
      dispatch(updateProductCategory({ id, name: categoryName })) // Updated to match the action's expected structure
        .then(() => {
          setSuccessMessage("Category updated successfully!");
          setTimeout(() => navigate("/admin/product/category/list"), 2000);
        })
        .catch((err) => {
          setSuccessMessage(`Error: ${err.message}`);
        });
    } else {
      dispatch(createProductCategory({ name: categoryName }))
        .then(() => {
          setSuccessMessage("Category created successfully!");
          setTimeout(() => navigate("/admin/product/category/list"), 2000);
        })
        .catch((err) => {
          setSuccessMessage(`Error: ${err.message}`);
        });
    }
  };
  
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
          {successMessage}
        </div>
      )}

      <Card>
        <CardHeader variant="gradient" color="blue-gray" className="mb-8 p-6">
          <div className="flex justify-between items-center">
            <Typography variant="h6" color="white">
              {isEdit ? "Edit Category" : "Create Category"}
            </Typography>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="mb-4">
            <Input
              label="Category Name"
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button
              color="green"
              onClick={handleSubmit}
              disabled={categoryName.trim() === ""}
            >
              {isEdit ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateCategory;
