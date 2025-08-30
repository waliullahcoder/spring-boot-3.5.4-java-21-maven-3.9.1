import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Typography, CardHeader, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../../../slices/product/action";
import Modal from "react-modal";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, status, error } = useSelector((state) => state.product);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
console.log("WALI",products);

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(""), 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  const handleEdit = (id) => {
    navigate(`/admin/product/edit/${id}`);
  };

  const openModal = (id) => {
    setProductIdToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductIdToDelete(null);
  };

  const handleDelete = async () => {
    if (productIdToDelete !== null) {
      try {
        await dispatch(deleteProduct(productIdToDelete)).unwrap();
        setSuccessMessage("Product deleted successfully!");
        dispatch(fetchProducts());
        closeModal();
      } catch (err) {
        setSuccessMessage(`Error: ${err.message || "Failed to delete product."}`);
        closeModal();
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
console.log("WALI currentProducts",currentProducts);

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
              Product List
            </Typography>
            <Button color="green" onClick={() => navigate("/admin/product/create")}>
              Add Product
            </Button>
          </div>
        </CardHeader>

         {/* Search Box */}
        <CardHeader className="mb-8 p-6">
         <div className="mt-4">
            <Input
                      label="Search by Product Name"
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-6"
            />
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

          {status === "loading" ? (
            <Typography className="text-center mt-5">Loading...</Typography>
          ) : error ? (
            <Typography variant="small" color="red" className="text-center mt-5">
              Error: {error.message || "Failed to load products."}
            </Typography>
          ) : currentProducts.length > 0 ? (
            <>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["#", "Name", "Model", "Code", "Category", "Qty", "Sale Price", "Purchase Price", "Image", "Actions"].map(
                      (header) => (
                        <th key={header} className="border-b border-gray-200 py-3 px-5 text-left">
                          <Typography variant="small" className="font-bold uppercase text-gray-600">
                            {header}
                          </Typography>
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-3 px-5 border-b">{indexOfFirstProduct + index + 1}</td>
                      <td className="py-3 px-5 border-b">{product.name}</td>
                      <td className="py-3 px-5 border-b">{product.model || "N/A"}</td>
                      <td className="py-3 px-5 border-b">{product.code || "N/A"}</td>
                      <td className="py-3 px-5 border-b">{product.category_name || "N/A"}</td>
                      <td className="py-3 px-5 border-b">{product.quantity || 0}</td>
                      <td className="py-3 px-5 border-b">${product.sale_price.toFixed(2)}</td>
                      <td className="py-3 px-5 border-b">${product.purchase_price.toFixed(2)}</td>
                      <td className="py-3 px-5 border-b">
                        {product.image ? (
                          <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-16 h-16 object-cover" />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="py-3 px-5 border-b">
                        <div className="flex gap-2">
                          <Button size="sm" variant="text" color="blue" onClick={() => handleEdit(product.id)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="text" color="red" onClick={() => openModal(product.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4">
                <Button color="blue" variant="text" onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous
                </Button>
                <Typography variant="small">
                  Page {currentPage} of {totalPages}
                </Typography>
                <Button color="blue" variant="text" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </>
          ) : (
            <Typography className="text-center p-5">No products found.</Typography>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Confirmation"
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="text-center">
          <Typography variant="h6">Are you sure you want to delete this product?</Typography>
          <div className="mt-4 flex justify-center gap-4">
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

export default ProductList;
