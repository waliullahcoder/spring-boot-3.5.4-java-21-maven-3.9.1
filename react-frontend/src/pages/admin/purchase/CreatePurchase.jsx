import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "@material-tailwind/react";
import Select from "react-select";
import { createPurchase } from "../../../slices/purchase/action";
import { fetchVendors } from "../../../slices/vendor/action";
import { fetchProducts } from "../../../slices/product/action";
import { useNavigate } from "react-router-dom";
import {
  setVendor,
  addProduct,
  removeProduct,
  updateQuantity,
  setDiscount,
  setTax,
  setSelectedProduct,
  setQuantity,
} from "../../../slices/purchase/reducer";

const CreatePurchase = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

  // Extracting state from Redux
  const { products, vendor, discount, tax, selectedProduct, quantity } = useSelector(
    (state) => state.purchase
  );
  const { vendors, loading: vendorLoading } = useSelector((state) => state.vendor);
  const { productLists, loading: productLoading } = useSelector((state) => state.product);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch products and vendors when the component mounts
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchVendors());
  }, [dispatch]);

  // Add Product Handler
  const handleAddProduct = () => {
    const product = productLists.find((prod) => prod.id === selectedProduct?.value);
    if (product) {
      dispatch(addProduct({ id: product.id, name: product.name, price: product.sale_price, quantity }));
    }
  };

  // Remove Product Handler
  const handleRemoveProduct = (id) => {
    dispatch(removeProduct(id));
  };

  // Quantity Change Handler
  const handleQuantityChange = (id, increment) => {
    dispatch(updateQuantity({ id, increment }));
  };

  // Calculate Totals
  const calculateTotals = () => {
    const subTotal = products.reduce((acc, product) => acc + product.total, 0);
    const discountAmount = (discount / 100) * subTotal;
    const taxAmount = (tax / 100) * (subTotal - discountAmount);
    const netTotal = subTotal - discountAmount + taxAmount;

    return { subTotal, discountAmount, taxAmount, netTotal };
  };

  const { subTotal, discountAmount, taxAmount, netTotal } = calculateTotals();

  // Submit Purchase Handler
  const handleSubmit = async () => {
    const purchaseOrder = {
      vendor_id: vendor,
      total_quantity: products.reduce((acc, product) => acc + product.quantity, 0),
      total_amount: subTotal,
      discount_persantage: discount,
      discount_amount: discountAmount,
      tax_persantage: tax,
      tax_amount: taxAmount,
      net_amount: netTotal,
    };

    const purchaseOrderDetails = products.map((product) => ({
      product_id: product.id,
      product_name: product.name,
      purchase_order_quantity: product.quantity,
      purchase_order_amount: product.total,
    }));

    const payload = { purchaseOrder, purchaseOrderDetails };

    try {
      dispatch(createPurchase(payload)).then((result) => {
             if (result.meta.requestStatus === "fulfilled") {
               setSuccessMessage("Purchase created successfully!");
               console.log("Purchase created successfully!");
             }
           });
    } catch (error) {
      console.error("Error creating purchase:", error);
    }
  };
    useEffect(() => {
      if (successMessage) {
        const timeout = setTimeout(() => {
          navigate("/admin/purchase/list");
        }, 2000); // Redirect after 2 seconds
        return () => clearTimeout(timeout);
      }
  
    }, [successMessage, navigate]);

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Create Purchase</h1>

      {/* Vendor Selection */}
      <div className="mb-4">
        <Select
          placeholder="Select Vendor"
          options={vendors.map((cust) => ({
            value: cust.id,
            label: `${cust.first_name} ${cust.last_name} (Phone: ${cust.phone_number})`,
          }))}
          value={vendors
            .map((cust) => ({ value: cust.id, label: `${cust.first_name} ${cust.last_name} (Phone: ${cust.phone_number})` }))
            .find((option) => option.value === vendor) || null}
          onChange={(selectedOption) => dispatch(setVendor(selectedOption.value))}
          isLoading={vendorLoading}
          isDisabled={vendorLoading}
        />
      </div>

      {/* Product Selection */}
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <Select
            placeholder="Select Product"
            options={productLists.map((prod) => ({
              value: prod.id,
              label: prod.name,
            }))}
            value={productLists
              .map((prod) => ({ value: prod.id, label: prod.name }))
              .find((option) => option.value === selectedProduct?.value) || null}
            onChange={(selectedOption) => dispatch(setSelectedProduct(selectedOption))}
            isLoading={productLoading}
            isDisabled={productLoading}
          />
        </div>
        <div className="w-1/4">
          <Input
            label="Quantity"
            type="number"
            value={quantity || ""}
            onChange={(e) => dispatch(setQuantity(Number(e.target.value)))}
          />
        </div>
        <Button color="blue" onClick={handleAddProduct}>
          Add Product
        </Button>
      </div>

      {/* Product List Table */}
      <div className="mb-4">
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>
                  <Button color="orange" onClick={() => handleQuantityChange(product.id, false)}>
                    -
                  </Button>
                  {product.quantity}
                  <Button color="green" onClick={() => handleQuantityChange(product.id, true)}>
                    +
                  </Button>
                </td>
                <td>{product.price}</td>
                <td>{product.total}</td>
                <td>
                  <Button color="red" onClick={() => handleRemoveProduct(product.id)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Discount and Tax Inputs */}
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <Input
            label="Discount (%)"
            type="number"
            value={discount}
            onChange={(e) => dispatch(setDiscount(Number(e.target.value)))}
          />
        </div>
        <div className="w-1/2">
          <Input
            label="Tax (%)"
            type="number"
            value={tax}
            onChange={(e) => dispatch(setTax(Number(e.target.value)))}
          />
        </div>
      </div>

      {/* Totals */}
      <div>
        <div>Subtotal: {subTotal}</div>
        <div>Discount: {discountAmount}</div>
        <div>Tax: {taxAmount}</div>
        <div>Net Total: {netTotal}</div>
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <Button color="green" onClick={handleSubmit}>
          Submit Purchase
        </Button>
      </div>
    </div>
  );
};

export default CreatePurchase;
