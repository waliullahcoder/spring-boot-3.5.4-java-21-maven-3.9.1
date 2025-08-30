import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Typography, CardHeader, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { fetchCustomers,deleteCustomer } from "../../../slices/customer/action";
import Modal from "react-modal";
const CustomerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers, status, error } = useSelector((state) => state.customer);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5); // Number of customers per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCustomers());
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
    console.log("Edit customer with ID:", id);
    navigate(`/customer/edit/${id}`);
  };

  const handleDelete = () => {
    if (selectedCustomerId) {
      dispatch(deleteCustomer(selectedCustomerId))
        .then(() => {
          setSuccessMessage("Customer deleted successfully!");
          setIsModalOpen(false); // Close modal after deletion
          setSelectedCustomerId(null); // Clear selected ID
  
          // Refetch customers from API to ensure updated data is shown
          dispatch(fetchCustomers());
        })
        .catch((error) => {
          console.error("Error deleting customer:", error);
        });
    }
  };
  
  const openModal = (id) => {
    setSelectedCustomerId(id); // Store the ID of the customer to be deleted
    setIsModalOpen(true); // Open the modal
  };


  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    deleteCustomer(null); // Clear the category ID
  };

  const handleInsert = () => {
    setSuccessMessage("Please wait.. going to create a new Customer...");
    navigate("/customer/create");
  };

  // Filter customers based on the search term
  const filteredCustomers = customers.filter((customer) => {
    const searchString = searchTerm.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(searchString) ||
      customer.last_name.toLowerCase().includes(searchString) ||
      customer.email.toLowerCase().includes(searchString) ||
      customer.phone_number.toLowerCase().includes(searchString)
    );
  });

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

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
              Customer List
            </Typography>
            <Button color="green" onClick={handleInsert}>
              Add Customer
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
          ) : currentCustomers.length > 0 ? (
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
                  {currentCustomers.map((customer, index) => {
                    const className = `py-3 px-5 border-b border-blue-gray-50`;
                    return (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className={className}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {indexOfFirstCustomer + index + 1}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {customer.first_name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {customer.last_name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {customer.email}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {customer.phone_number}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="text"
                              color="blue"
                              onClick={() => handleEdit(customer.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="text"
                              color="red"
                              onClick={() => openModal(customer.id)} // Open the modal with category id
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
              No customers found.
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
                  Are you sure you want to delete this Customer?
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

export default CustomerList;
