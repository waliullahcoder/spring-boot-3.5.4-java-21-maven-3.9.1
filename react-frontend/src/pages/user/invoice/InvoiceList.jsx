// InvoiceList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Typography, CardHeader, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { fetchInvoices } from "../../../slices/invoice/action";

const InvoiceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, status, error } = useSelector((state) => state.invoice);

  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(5); // Number of invoices per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        navigate("/invoice/create");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, navigate]);

  const handleInsert = () => {
    setSuccessMessage("Please wait.. going to create a new Invoice...");
  };
  const handleInvoiceShow = (id) => { 
   // navigate("/invoice/show");
    navigate(`/invoice/show/${id}`);
  };
  
  // Filter invoices based on the search term
  const filteredInvoices = orders?.orders?.filter((invoice) => {
    const searchString = searchTerm.toLowerCase();
    return (
      String(invoice.customer_id).toLowerCase().includes(searchString) ||
      String(invoice.id).toLowerCase().includes(searchString) ||
      String(invoice.status).toLowerCase().includes(searchString)
    );
  }) || [];

  // Pagination logic
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const dateStr = "2025-01-10T01:41:44.000Z";
  
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Use 12-hour format
  };
  
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(new Date(dateStr));
  console.log(formattedDate); // Output: January 10, 2025, 1 AM

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
              Invoice List
            </Typography>
            <Button color="green" onClick={handleInsert}>
              Add Invoice
            </Button>
          </div>
        </CardHeader>

        <CardHeader className="mb-8 p-6">
          <div className="mt-4">
            <Input
              label="Search by customer, invoice number, or status"
              type="text"
              placeholder="Search by customer, invoice number, or status"
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
          ) : currentInvoices.length > 0 ? (
            <>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {[
                      "#",
                      "Invoice Number",
                      "Customer Name",
                      "Total Quantity",
                      "Date",
                      "Net Amount",
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
                  {currentInvoices.map((invoice, index) => {
                    const className = `py-3 px-5 border-b border-blue-gray-50`;
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className={className}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {indexOfFirstInvoice + index + 1}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            INVOICENO{invoice.id}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {invoice.customer_first_name} {invoice.customer_last_name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {invoice.total_quantity}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {new Intl.DateTimeFormat("en-US", options).format(new Date(invoice.created_at))}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {invoice.net_amount}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="text"
                              color="blue"
                              onClick={() => handleInvoiceShow(invoice.id)}
                            >
                              Invoice Details
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
              No invoices found.
            </Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default InvoiceList;
