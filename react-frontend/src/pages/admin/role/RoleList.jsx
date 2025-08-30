import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Typography, CardHeader, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { fetchRoles, deleteRole } from "../../../slices/role/action";
import Modal from "react-modal";

const RoleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roles, status, error } = useSelector((state) => state.role);

  const [currentPage, setCurrentPage] = useState(1);
  const [categoryPerPage] = useState(5); // Number of roles per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null); // Store role ID to delete

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        navigate("/admin/role/list");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, navigate]);

  const handleEdit = (id) => {
    navigate(`/admin/role/edit/${id}`);
  };

  const openModal = (id) => {
    setCategoryIdToDelete(id); // Set the role ID to be deleted
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setCategoryIdToDelete(null); // Clear the role ID
  };

  const handleDelete = () => {
    if (categoryIdToDelete !== null) {
      dispatch(deleteRole(categoryIdToDelete))
        .then(() => {
          setSuccessMessage("role deleted successfully!");
          // Refetch roles after delete
          dispatch(fetchRoles());
          closeModal(); // Close the modal after delete
        })
        .catch((err) => {
          setSuccessMessage(`Error: ${err.message}`);
          closeModal(); // Close the modal in case of an error
        });
    }
  };

  const handleInsert = () => {
    navigate("/admin/role/create");
  };

  // Filter roles based on the search term
  const filteredCategories = roles?.filter((role) => {
    const searchString = searchTerm.toLowerCase();
    return role?.name?.toLowerCase().includes(searchString);
  }) || [];
  

  // Pagination logic
  const indexOfLastCategory = currentPage * categoryPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoryPerPage;
  const currentRoles = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  const totalPages = Math.ceil(filteredCategories.length / categoryPerPage);

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
              role List
            </Typography>
            <Button color="green" onClick={handleInsert}>
              Add role
            </Button>
          </div>
        </CardHeader>

        {/* Search Box */}
        <CardHeader className="mb-8 p-6">
          <div className="mt-4">
            <Input
              label="Search by role name"
              type="text"
              placeholder="Search by role name"
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
          ) : currentRoles.length > 0 ? (
            <>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["S/L", "ROLE ID", "User Name","User Email", "Role Name", "Actions"].map((el) => (
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
                  {currentRoles.map((role, index) => {
                    const className = `py-3 px-5 border-b border-blue-gray-50`;
                    return (
                      <tr key={role.id} className="hover:bg-gray-50">
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
                            {role.id}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {role.user_first_name || null} {role.user_last_name || null}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {role.user_email || null}
                          </Typography>
                        </td>
                        <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {role.name ? role.name : "No Name"}
                        </Typography>

                        </td>
                        <td className={className}>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="text"
                              color="blue"
                              onClick={() => handleEdit(role.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="text"
                              color="red"
                              onClick={() => openModal(role.id)} // Open the modal with role id
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
              No roles found.
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
            Are you sure you want to delete this role?
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

export default RoleList;
