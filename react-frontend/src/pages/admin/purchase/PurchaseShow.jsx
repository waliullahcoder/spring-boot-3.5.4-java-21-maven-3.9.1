import React, { useEffect, useRef } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { purchaseShow } from "../../../slices/purchase/action";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { numberToWords, defaultCurrency } from "../../../utils/helpers";

const PurchaseShow = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { purchase, status, error } = useSelector((state) => state.purchase);

  const purchaseRef = useRef();

  useEffect(() => {
    dispatch(purchaseShow(id));
  }, [dispatch, id]);
  
  console.log("WALI ", defaultCurrency(), id, purchase, purchase?.purchaseOrderDetails);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Use 12-hour format
  };

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleDownloadPDF = () => {
    const content = purchaseRef.current;

    // Use html2canvas to convert the content into an image
    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const doc = new jsPDF();
      doc.addImage(imgData, "PNG", 10, 10, 180, 0); // Adjust the width and position of the image
      doc.save("purchase.pdf"); // Download the generated PDF
    });
  };

  return (
    <div>
      {/* Wrap the purchase content inside a div and use the ref */}
      <div ref={purchaseRef} className="w-full max-w-3xl p-6 shadow-lg bg-white">
        <Card className="w-full max-w-3xl p-6 shadow-lg bg-white">
          <div className="flex bg-gray-200 text-gray-700 justify-between items-center border-b pb-4 mb-4">
            <Typography variant="h5" className="font-bold pl-1.5 pt-0.6">Purchase</Typography>
            <Typography className="text-gray-500 pr-1.5 pt-0.6">#INVOICENO{purchase?.id}</Typography>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="h6" className="font-semibold pl-1.5">From:</Typography>
              <Typography className="text-gray-700 pl-1.5">AccPost Software Co. Ltd.</Typography>
              <Typography className="text-gray-500 pl-1.5">H#15, R#06, Block-E, Banasree, Dhaka</Typography>
              <Typography className="text-gray-500 pl-1.5">Mobile: +8801575020231</Typography>
            </div>
            <div>
              <Typography variant="h6" className="font-semibold">To:</Typography>
              <Typography className="text-gray-700">{purchase?.vendor_first_name} {purchase?.vendor_last_name}</Typography>
              <Typography className="text-gray-500">{purchase?.vendor_address}, {purchase?.vendor_phone_no}, {purchase?.vendor_email}, {purchase?.zip_code}</Typography>
              <Typography className="text-gray-500">
                {purchase?.created_at ? new Intl.DateTimeFormat("en-US", options).format(new Date(purchase.created_at)) : "N/A"}
              </Typography>
            </div>
          </div>

          <table className="w-full mt-6 border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-2 text-left">S/L</th>
                <th className="p-2 text-right">Product ID</th>
                <th className="p-2 text-right">Product</th>
                <th className="p-2 text-right">Quantity</th>
                <th className="p-2 text-right">SubTotal</th>
              </tr>
            </thead>
            <tbody>
              {purchase?.purchaseOrderDetails?.length > 0 ? (
                <>
                  {purchase.purchaseOrderDetails.map((orderd, index) => (
                    <tr className="border-t" key={orderd.id}>
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2 text-right">{orderd.product_id}</td>
                      <td className="p-2 text-right">{orderd.product_name}</td>
                      <td className="p-2 text-right">{orderd.purchase_order_quantity}</td>
                      <td className="p-2 text-right">{defaultCurrency()}{orderd.purchase_order_amount}</td>
                    </tr>
                  ))}
                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Total Quantity</th>
                    <th className="p-2 text-right">{purchase?.total_quantity || 0}</th>
                    <th className="p-2 text-right"></th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Total Amount</th>
                    <th className="p-2 text-right">{defaultCurrency()} {purchase?.total_amount || 0} </th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Tax Amount (% {purchase?.tax_persantage || 0})</th>
                    <th className="p-2 text-right">{defaultCurrency()}{purchase?.tax_amount || 0}</th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Tax Included Amount</th>
                    <th className="p-2 text-right">{defaultCurrency()}{purchase?.tax_amount+purchase?.total_amount || 0}</th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Discount Amount (% {purchase?.discount_persantage || 0})</th>
                    <th className="p-2 text-right">{defaultCurrency()}{purchase?.discount_amount || 0}</th>
                  </tr>

                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Net Amount</th>
                    <th className="p-2 text-right">{defaultCurrency()}{purchase?.net_amount || 0} </th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-center" colSpan={5}><br/>
                    In Word: {numberToWords(purchase?.net_amount)}<br/><br/>
                    </th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-center  bg-gray-200 text-gray-700" colSpan={5}><br/>
                      Note: This note and comment are about the purchase policy<br/><br/>
                    </th>
                  </tr>

                </>
              ) : (
                <tr>
                  <td className="p-2 text-center" colSpan={5}>
                    No order details available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
       
      </div>
      <button onClick={handleDownloadPDF} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">Download as PDF</button>
    </div>
  );
};

export default PurchaseShow;
