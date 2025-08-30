import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Typography, CardHeader, Input } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { createRole, updateRole } from "../../../slices/role/action";
import { fetchUserList } from "../../../slices/auth/authSlice";
import Select from 'react-select';

const CreateRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { roles } = useSelector((state) => state.role);
  const users = useSelector((state) => state.auth?.users) || [];
  const status = useSelector((state) => state.auth?.status) || "idle";
  const error = useSelector((state) => state.auth?.error) || null;

  const [roleName, setRoleName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    user_id: '',
  });

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const role = roles.find((role) => role.id === parseInt(id));
      if (role) {
        setRoleName(role.name);
        setFormData({ user_id: role.user_id }); // Prefill user_id when editing
      }
    }
  }, [id, roles]);

  const handleSubmit = () => {
    if (isEdit) {
      dispatch(updateRole({ id, user_id: formData.user_id, name: roleName })).then(() => {
        setSuccessMessage("Role updated successfully!");
        setTimeout(() => navigate("/admin/role/list"), 2000);
      });
    } else {
      dispatch(createRole({ user_id: formData.user_id, name: roleName })).then(() => {
        setSuccessMessage("Role created successfully!");
        setTimeout(() => navigate("/admin/role/list"), 2000);
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-5 bg-white rounded-md shadow-lg">
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
          {successMessage}
        </div>
      )}
      <Card>
        <CardHeader variant="gradient" color="blue-gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">{isEdit ? "Edit Role" : "Create Role"}</Typography>
        </CardHeader>
        <CardBody>
          {/* User Selection */}
          <div className="mb-4">
            {users && users.length > 0 ? (
              <Select
                placeholder="Select User"
                options={users.map((user) => ({ value: user.id, label: user.email }))}
                value={users
                  .map((user) => ({ value: user.id, label: user.email }))
                  .find((option) => option.value === formData.user_id) || null}
                onChange={(selectedOption) =>
                  setFormData((prevState) => ({ ...prevState, user_id: selectedOption.value }))
                }
              />
            ) : status === 'loading' ? (
              <p>Loading users...</p>
            ) : (
              <p className="text-red-500">
                Failed to load users: {error?.message || "An unknown error occurred"}
              </p>
            )}
          </div>

          {/* Role Name Input */}
          <div className="mb-4">
            <Input label="Role Name" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
          </div>

          {/* Submit Button */}
          <Button 
            color="green" 
            onClick={handleSubmit} 
            disabled={!formData.user_id || roleName.trim() === ""}
          >
            {isEdit ? "Update Role" : "Create Role"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateRole;
