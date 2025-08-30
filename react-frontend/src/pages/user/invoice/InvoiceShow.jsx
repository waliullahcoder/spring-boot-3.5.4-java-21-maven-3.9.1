import React, { useEffect, useRef } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { invoiceShow } from "../../../slices/invoice/action";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { numberToWords, defaultCurrency } from ".././../../utils/helpers";

const InvoiceShow = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { invoice, status, error } = useSelector((state) => state.invoice);

  const invoiceRef = useRef();

  useEffect(() => {
    dispatch(invoiceShow(id));
  }, [dispatch, id]);

  console.log("WALI ", defaultCurrency(), id, invoice, invoice?.orderDetails);

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
    const content = invoiceRef.current;

    // Use html2canvas to convert the content into an image
    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const doc = new jsPDF();
      doc.addImage(imgData, "PNG", 10, 10, 180, 0); // Adjust the width and position of the image
      doc.save("invoice.pdf"); // Download the generated PDF
    });
  };

  return (
    <div>
      {/* Wrap the invoice content inside a div and use the ref */}
      <div ref={invoiceRef} className="w-full max-w-3xl p-6 shadow-lg bg-white">
        <Card className="w-full max-w-3xl p-6 shadow-lg bg-white">
          <div className="flex bg-gray-200 text-gray-700 justify-between items-center border-b pb-4 mb-4">
            <Typography variant="h5" className="font-bold pl-1.5 pt-0.6">Invoice</Typography>
            <Typography className="text-gray-500 pr-1.5 pt-0.6">#INVOICENO{invoice?.id}</Typography>
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
              <Typography className="text-gray-700">{invoice?.customer_first_name} {invoice?.customer_last_name}</Typography>
              <Typography className="text-gray-500">{invoice?.customer_address}, {invoice?.customer_phone_no}, {invoice?.customer_email}, {invoice?.zip_code}</Typography>
              <Typography className="text-gray-500">
                {invoice?.created_at ? new Intl.DateTimeFormat("en-US", options).format(new Date(invoice.created_at)) : "N/A"}
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
              {invoice?.orderDetails?.length > 0 ? (
                <>
                  {invoice.orderDetails.map((orderd, index) => (
                    <tr className="border-t" key={orderd.id}>
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2 text-right">{orderd.product_id}</td>
                      <td className="p-2 text-right">{orderd.product_name}</td>
                      <td className="p-2 text-right">{orderd.order_quantity}</td>
                      <td className="p-2 text-right">{defaultCurrency()}{orderd.order_amount}</td>
                    </tr>
                  ))}
                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Total Quantity</th>
                    <th className="p-2 text-right">{invoice?.total_quantity || 0}</th>
                    <th className="p-2 text-right"></th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Total Amount</th>
                    <th className="p-2 text-right">{defaultCurrency()} {invoice?.total_amount || 0} </th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Tax Amount (% {invoice?.tax_persantage || 0})</th>
                    <th className="p-2 text-right">{defaultCurrency()}{invoice?.tax_amount || 0}</th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Tax Included Amount</th>
                    <th className="p-2 text-right">{defaultCurrency()}{invoice?.tax_amount+invoice?.total_amount || 0}</th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Discount Amount (% {invoice?.discount_persantage || 0})</th>
                    <th className="p-2 text-right">{defaultCurrency()}{invoice?.discount_amount || 0}</th>
                  </tr>

                  <tr className="border-t">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right"></th>
                    <th className="p-2 text-right">Net Amount</th>
                    <th className="p-2 text-right">{defaultCurrency()}{invoice?.net_amount || 0} </th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-center" colSpan={5}><br/>
                    In Word: {numberToWords(invoice?.net_amount)}<br/><br/>
                    </th>
                  </tr>
                  <tr className="border-t">
                    <th className="p-2 text-center  bg-gray-200 text-gray-700" colSpan={5}><br/>
                      Note: This note and comment are about the invoice policy<br/><br/>
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

export default InvoiceShow;
