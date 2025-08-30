import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Typography, CardHeader, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { fetchPermissions, deletePermission } from "../../../slices/permission/action";
import Modal from "react-modal";

const PermissionList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { permissions, status, error } = useSelector((state) => state.permission);

  const [currentPage, setCurrentPage] = useState(1);
  const [categoryPerPage] = useState(5); // Number of permissions per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null); // Store permission ID to delete

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    console.log("Fetched Permissions:", permissions); // Log to check permissions structure
  }, [permissions]);

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        navigate("/admin/permission/list");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, navigate]);

  const handleEdit = (id) => {
    navigate(`/admin/permission/edit/${id}`);
  };

  const openModal = (id) => {
    setCategoryIdToDelete(id); // Set the permission ID to be deleted
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setCategoryIdToDelete(null); // Clear the permission ID
  };

  const handleDelete = () => {
    if (categoryIdToDelete !== null) {
      dispatch(deletePermission(categoryIdToDelete))
        .then(() => {
          setSuccessMessage("Permission deleted successfully!");
          // Refetch permissions after delete
          dispatch(fetchPermissions());
          closeModal(); // Close the modal after delete
        })
        .catch((err) => {
          setSuccessMessage(`Error: ${err.message}`);
          closeModal(); // Close the modal in case of an error
        });
    }
  };

  const handleInsert = () => {
    navigate("/admin/permission/create");
  };

  // Filter permissions based on the search term
  const filteredPermissions = Array.isArray(permissions)
    ? permissions.filter((permission) => {
        const searchString = searchTerm.toLowerCase();
        return permission.module_name?.toLowerCase().includes(searchString); // Safely access `module_name`
      })
    : [];

  // Pagination logic
  const indexOfLastCategory = currentPage * categoryPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoryPerPage;
  const currentPermissions = filteredPermissions.slice(indexOfFirstCategory, indexOfLastCategory);

  const totalPages = Math.ceil(filteredPermissions.length / categoryPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
              Permission List
            </Typography>
            <Button color="green" onClick={handleInsert}>
              Add Permission
            </Button>
          </div>
        </CardHeader>

        {/* Search Box */}
        <CardHeader className="mb-8 p-6">
          <div className="mt-4">
            <Input
              label="Search by permission name"
              type="text"
              placeholder="Search by permission name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {status === "loading" ? (
            <Typography className="text-center mt-5">Loading...</Typography>
          ) : error?.message ? ( // Access error.message
            <Typography
              variant="small"
              color="red"
              className="text-center mt-5"
            >
              Error: {error.message}
            </Typography>
          ) : currentPermissions.length > 0 ? (
            <>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["S/L", "Role", "Module ID", "Module Name", "create", "listing", "view", "edit", "delete", "allow", "Actions"].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentPermissions.map((permission, index) => {
                    const className = `py-3 px-5 border-b border-blue-gray-50`;
                    return (
                      <tr key={permission.id} className="hover:bg-gray-50">
                        <td className={className}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {indexOfFirstCategory + index + 1}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {permission.role_name || null} ({permission.role_id || null})
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {permission.module_id || "N/A"} 
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {permission.module_name || "N/A"} 
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            className={`text-xs font-semibold ${
                              permission.create ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {permission.create ? "True" : "False"}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            className={`text-xs font-semibold ${
                              permission.listing ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {permission.listing ? "True" : "False"}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            className={`text-xs font-semibold ${
                              permission.view ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {permission.view ? "True" : "False"}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            className={`text-xs font-semibold ${
                              permission.edit ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {permission.edit ? "True" : "False"}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            className={`text-xs font-semibold ${
                              permission.delete ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {permission.delete ? "True" : "False"}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            className={`text-xs font-semibold ${
                              permission.allow ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {permission.allow ? "True" : "False"}
                          </Typography>
                        </td>

                        <td className={className}>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="text"
                              color="blue"
                              onClick={() => handleEdit(permission.role_id)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="text"
                              color="red"
                              onClick={() => openModal(permission.role_id)} // Open the modal with permission id
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <Button
                  color="blue"
                  variant="text"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Typography variant="small">
                  Page {currentPage} of {totalPages}
                </Typography>
                <Button
                  color="blue"
                  variant="text"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <Typography className="text-center p-5">
              No permissions found.
            </Typography>
          )}
        </CardBody>
      </Card>

      {/* Modal for delete confirmation */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Confirmation"
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl z-50"
        overlayClassName="fixed inset-0 bg-black opacity-50 flex justify-center items-center"
      >
        <div className="text-center">
          <Typography variant="h6" color="blue-gray">
            Are you sure you want to delete this permission?
          </Typography>
          <div className="mt-6 flex justify-center gap-4">
            <Button color="red" onClick={handleDelete} className="w-32">
              Yes, Delete
            </Button>
            <Button color="gray" onClick={closeModal} className="w-32">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PermissionList;
