import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Typography, CardHeader, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { fetchVendors,deleteVendor } from "../../../slices/vendor/action";
import Modal from "react-modal";
const VendorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendors, status, error } = useSelector((state) => state.vendor);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorsPerPage] = useState(5); // Number of vendors per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, navigate]);

  const handleEdit = (id) => {
    console.log("Edit vendor with ID:", id);
    navigate(`/admin/vendor/edit/${id}`);
  };

  const handleDelete = () => {
    if (selectedVendorId) {
      dispatch(deleteVendor(selectedVendorId))
        .then(() => {
          setSuccessMessage("vendor deleted successfully!");
          setIsModalOpen(false); // Close modal after deletion
          setSelectedVendorId(null); // Clear selected ID
  
          // Refetch vendors from API to ensure updated data is shown
          dispatch(fetchVendors());
        })
        .catch((error) => {
          console.error("Error deleting vendor:", error);
        });
    }
  };
  
  const openModal = (id) => {
    setSelectedVendorId(id); // Store the ID of the vendor to be deleted
    setIsModalOpen(true); // Open the modal
  };


  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    deleteVendor(null); // Clear the category ID
  };

  const handleInsert = () => {
    setSuccessMessage("Please wait.. going to create a new vendor...");
    navigate("/admin/vendor/create");
  };

  // Filter vendors based on the search term
  const filteredVendors = vendors.filter((vendor) => {
    const searchString = searchTerm.toLowerCase();
    return (
      vendor.first_name.toLowerCase().includes(searchString) ||
      vendor.last_name.toLowerCase().includes(searchString) ||
      vendor.email.toLowerCase().includes(searchString) ||
      vendor.phone_number.toLowerCase().includes(searchString)
    );
  });

  // Pagination logic
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

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
              vendor List
            </Typography>
            <Button color="green" onClick={handleInsert}>
              Add vendor
            </Button>
          </div>
        </CardHeader>

        {/* Search Box */}
        <CardHeader className="mb-8 p-6">
          <div className="mt-4">
            <Input
             label="Search by name, email, or phone number"
              type="text"
              placeholder="Search by name, email, or phone number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        </CardHeader>

        
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {status === "loading" ? (
            <Typography className="text-center mt-5">Loading...</Typography>
          ) : error ? (
            <Typography
              variant="small"
              color="red"
              className="text-center mt-5"
            >
              Error: {error}
            </Typography>
          ) : currentVendors.length > 0 ? (
            <>
            
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {[
                      "#",
                      "First Name",
                      "Last Name",
                      "Email",
                      "Phone Number",
                      "Actions",
                    ].map((el) => (
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
                  {currentVendors.map((vendor, index) => {
                    const className = `py-3 px-5 border-b border-blue-gray-50`;
                    return (
                      <tr key={vendor.id} className="hover:bg-gray-50">
                        <td className={className}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {indexOfFirstVendor + index + 1}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {vendor.first_name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {vendor.last_name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {vendor.email}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {vendor.phone_number}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="text"
                              color="blue"
                              onClick={() => handleEdit(vendor.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="text"
                              color="red"
                              onClick={() => openModal(vendor.id)} // Open the modal with category id
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
              No vendors found.
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
                  Are you sure you want to delete this vendor?
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

export default VendorList;
