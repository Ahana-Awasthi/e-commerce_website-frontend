import React, { useState, useEffect } from "react";
import NavBar from "./Nav";
import "./OrderDetails.css";
import Loading from "./Loading";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

// Icons
import { FaCheckCircle, FaBoxOpen, FaTruck, FaHome } from "react-icons/fa";
import { MdPayment, MdSupportAgent } from "react-icons/md";
import { FiDownload } from "react-icons/fi";

const OrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [showInvoicePreview, setShowInvoicePreview] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({});
  const [lineWidth, setLineWidth] = useState(0);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const userName = localStorage.getItem("userName") || "Customer";
  // Temporary Preview
  const InvoicePreview = ({
    order,
    products,
    userName,
    orderStatus,
    formatPaymentMethod,
  }) => {
    const items = Array.isArray(order.products) ? order.products : [];
    const total = order.total;
    const tax = Math.round(total * 0.05);
    const shipping = total > 1000 ? 0 : 50;
    const discount = total > 500 ? total * 0.1 : 0;
    if (!order) return null;
    return (
      <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
        {/* Header */}
        <div
          style={{
            borderBottom: "3px solid #6a5acd",
            paddingBottom: 20,
            marginBottom: 20,
          }}
        >
          <h1 style={{ margin: 0, color: "#6a5acd", fontSize: 28 }}>INVOICE</h1>
          <p>Order #{order.orderId}</p>
        </div>

        {/* Order Info */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 30,
            marginBottom: 30,
          }}
        >
          <div>
            <h3 style={{ color: "#6a5acd" }}>Bill From</h3>
            <p>
              <b>Shopora Trades Private Limited</b>
            </p>
          </div>

          <div>
            <h3 style={{ color: "#6a5acd" }}>Bill To</h3>
            <p>
              <b>{userName}</b>
            </p>
            <p>{order.deliveryAddress}</p>
          </div>
        </div>

        {/* Order Details */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <div>
            <p>
              Order Date:{" "}
              {new Date(order.orderDate).toLocaleDateString("en-IN")}
            </p>
            <p>Status: {orderStatus}</p>
          </div>

          <div>
            <p>Payment: {formatPaymentMethod(order.paymentMethod)}</p>
            <p>ID: {order.orderId}</p>
          </div>
        </div>

        {/* Items */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {(order.products || []).map((item, idx) => {
              const product = products[item.productId];
              const itemTotal = (product?.price || 0) * item.quantity;

              return (
                <tr key={idx}>
                  <td>{product?.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{product?.price}</td>
                  <td>₹{itemTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Summary */}
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <p>Subtotal: ₹{Math.floor(total)}</p>
          <p>Tax: ₹{tax}</p>
          <p>Shipping: ₹{shipping}</p>
          <p>Discount: {discount === 0 ? "None" : "10%"}</p>

          <h3>Total: ₹{Math.round(total + tax + shipping - discount)}</h3>
        </div>
      </div>
    );
  };
  // Helper function to format payment method
  const formatPaymentMethod = (method) => {
    const paymentMethods = {
      cod: "Cash On Delivery",
      credit_card: "Credit Card",
      debit_card: "Debit Card",
      upi: "UPI",
      wallet: "Digital Wallet",
      netbanking: "Net Banking",
    };
    return paymentMethods[method?.toLowerCase()] || method || "N/A";
  };

  // Function to generate and download PDF invoice
  const generateInvoicePDF = async () => {
    if (!order || !products) return;

    setDownloadingPDF(true);
    try {
      // Dynamic import of PDF libraries
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).jsPDF;

      // Create a temporary container for invoice
      const invoiceContent = document.createElement("div");
      invoiceContent.style.padding = "20px";
      invoiceContent.style.width = "800px";
      invoiceContent.style.backgroundColor = "white";
      invoiceContent.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <!-- Header -->
          <div style="border-bottom: 3px solid #6a5acd; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="margin: 0; color: #6a5acd; font-size: 28px;">INVOICE</h1>
            <p style="margin: 5px 0; color: #666;">Order #${order.orderId}</p>
          </div>

          <!-- Order Info -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <div>
              <h3 style="color: #6a5acd; margin-bottom: 10px; font-size: 14px; text-transform: uppercase;">Bill From</h3>
              <p style="margin: 5px 0; font-weight: bold;">Shopora Trades Private Limited</p>
              <p style="margin: 5px 0; color: #666; font-size: 12px;">Your Trusted Online Store</p>
            </div>
            <div>
              <h3 style="color: #6a5acd; margin-bottom: 10px; font-size: 14px; text-transform: uppercase;">Bill To</h3>
              <p style="margin: 5px 0; font-weight: bold;">${userName}</p>
              <p style="margin: 5px 0; color: #666; font-size: 12px;">${order.deliveryAddress}</p>
            </div>
          </div>

          <!-- Order Details -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <div>
              <p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString("en-IN")}</p>
              <p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>Status:</strong> ${orderStatus}</p>
            </div>
            <div>
              <p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>Payment Method:</strong> ${formatPaymentMethod(order.paymentMethod)}</p>
              <p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>Order ID:</strong> ${order.orderId}</p>
            </div>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #f5f7fa; border-bottom: 2px solid #6a5acd;">
                <th style="padding: 12px; text-align: left; font-weight: bold; color: #6a5acd; border: 1px solid #ddd;">Item</th>
                <th style="padding: 12px; text-align: center; font-weight: bold; color: #6a5acd; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 12px; text-align: right; font-weight: bold; color: #6a5acd; border: 1px solid #ddd;">Unit Price</th>
                <th style="padding: 12px; text-align: right; font-weight: bold; color: #6a5acd; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(order.products || [])
                .map((item, idx) => {
                  const product = products[item.productId];
                  const itemTotal = (product?.price || 0) * item.quantity;
                  return `
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px; border: 1px solid #ddd;">${product?.name || "Product"}</td>
                      <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                      <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">₹${product?.price || 0}</td>
                      <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">₹${itemTotal}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>

          <!-- Summary -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
            <div style="width: 300px;">
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd;">
                <span>Subtotal:</span>
                <span>₹${Math.floor(order.total)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd;">
                <span>Tax (5%):</span>
                <span>₹${tax || "0(Tax-free delivery on bigger orders)"}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd;">
                <span>Shipping:</span>
                <span>${shipping === 0 ? "Free" : "₹ " + shipping}</span>
              </div>
             <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd;">
  <span>Discount:</span>
  <span>${discount === 0 ? "None" : "10%"}</span>
</div>
              <div style="display: flex; justify-content: space-between; padding: 15px 0; font-size: 16px; font-weight: bold; color: #27ae60; border-top: 2px solid #6a5acd;">
                <span>TOTAL:</span>
                <span>₹${Math.round(order.total + tax + shipping - discount)}</span>
              </div>
            </div>

            </div>
          </div>

          <!-- Footer -->
          <div style="border-top: 2px solid #6a5acd; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;">Thank you for your purchase!</p>
            <p style="margin: 5px 0;">For support, please visit our website or contact customer service.</p>
            <p style="margin: 5px 0; color: #999;">Generated on ${new Date().toLocaleDateString("en-IN")}</p>
          </div>
        </div>
      `;

      // Append to body temporarily
      document.body.appendChild(invoiceContent);

      // Convert to canvas
      const canvas = await html2canvas(invoiceContent, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate aspect ratio and fit to page
      const imgWidth = pdfWidth - 20; // 10mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Download
      pdf.save(`Invoice_${order.orderId}.pdf`);

      // Clean up
      document.body.removeChild(invoiceContent);
    } catch (err) {
      console.error("Error generating PDF:", err);
      if (
        err.message.includes("Cannot find module") ||
        err.type === "MODULE_NOT_FOUND"
      ) {
        alert(
          "PDF libraries not installed. Please run: npm install jspdf html2canvas",
        );
      } else {
        alert("Failed to generate invoice. Please try again.");
      }
    } finally {
      setDownloadingPDF(false);
    }
  };

  // Animation effect for progress line
  useEffect(() => {
    if (order) {
      // Calculate target width based on current status
      const orderStatus = order?.status || "Placed";
      const steps = [
        { name: "Placed" },
        { name: "Confirmed" },
        { name: "Shipped" },
        { name: "Out for Delivery" },
        { name: "Delivered" },
      ];
      const statusIndex = steps.findIndex((s) => s.name === orderStatus);
      const targetWidth =
        statusIndex >= 0 ? (statusIndex / (steps.length - 1)) * 100 : 0;

      const interval = setInterval(() => {
        setLineWidth((prev) => {
          if (prev < targetWidth) {
            return Math.min(prev + 2, targetWidth);
          }
          return targetWidth;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [order]);
  const total = order?.total || 0;

  const tax = Math.round(total * 0.05);
  const shipping = total > 1000 ? 0 : 50;
  const discount = total > 500 ? total * 0.1 : 0;

  const status = order?.status || "Placed";
  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Session expired. Please login again.");
          setLoading(false);
          return;
        }

        const response = await api.get(`/orders/${orderId}`);

        setOrder(response.data.order);

        // Fetch product details for all items in the order
        if (
          response.data.order.products &&
          response.data.order.products.length > 0
        ) {
          const productsRes = await api.get("/products");
          const productMap = {};
          productsRes.data.forEach((p) => {
            productMap[p._id] = p;
          });
          setProducts(productMap);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const steps = [
    { name: "Placed", icon: <FaBoxOpen /> },
    { name: "Confirmed", icon: <MdPayment /> },
    { name: "Shipped", icon: <FaTruck /> },
    { name: "Out for Delivery", icon: <FaTruck /> },
    { name: "Delivered", icon: <FaCheckCircle /> },
  ];

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return (
      <>
        <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ color: "red" }}>{error || "Order not found"}</p>
          <button
            onClick={() => navigate("/profile")}
            style={{
              padding: "10px 20px",
              marginTop: "20px",
              cursor: "pointer",
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Back to Orders
          </button>
        </div>
      </>
    );
  }

  // Ensure status exists and default to Placed if undefined
  const orderStatus = order?.status || "Placed";
  const statusIndex = steps.findIndex((s) => s.name === orderStatus);
  const orderItems = order.products || [];

  // Get status messages
  const statusMessages = {
    Placed: "Order placed successfully",
    Confirmed: "Your order is confirmed",
    Shipped: "Your order is on the way",
    "Out for Delivery": "Your order is out for delivery",
    Delivered: "Your order has been delivered",
    "problem:cancel": "Order Cancelled",
    "problem:return": "Order Returned",
    "problem:exchange": "Order Exchanged",
  };

  // Problem status display messages
  const problemMessages = {
    "problem:cancel": "This order has been cancelled",
    "problem:return": "This order has been returned",
    "problem:exchange": "This order is being exchanged",
  };

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <div className="order-container">
        {/* Header */}
        <motion.div
          className="order-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h2 className="order-id">Order {order.orderId}</h2>
            <p>
              Placed on:{" "}
              {new Date(order.orderDate).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <motion.div className="order-status" whileHover={{ scale: 1.05 }}>
            <FaCheckCircle className="status-icon" />
            <div>
              <h4>Order {orderStatus}</h4>
              <p>{statusMessages[orderStatus]}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress - Only show if not a problem status */}
        {!orderStatus.startsWith("problem:") && (
          <>
            <h3 className="section-title">Order Progress</h3>
            <div className="progress-container">
              {/* Animated progress line */}
              <div
                className="progress-line-animated"
                style={{
                  width: `${lineWidth}%`,
                  marginTop: 30,
                }}
              />

              {steps.map((step, index) => {
                // Check if this step should be colored
                const isCompleted = index < statusIndex;
                const isActive = index === statusIndex;
                const isFuture = index > statusIndex;

                // Draw line should reach this circle based on line animation
                const stepPosition = (index / (steps.length - 1)) * 100;
                const shouldBeColored = lineWidth >= stepPosition;

                return (
                  <motion.div
                    key={index}
                    className="step"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <motion.div
                      className={`circle ${shouldBeColored ? "active" : "inactive"}`}
                      animate={{
                        scale: shouldBeColored ? [1, 1.3, 1] : 1,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: shouldBeColored ? 0.2 : 0,
                      }}
                    >
                      <span className="step-icon">{step.icon}</span>
                    </motion.div>
                    <p
                      className={`step-name ${shouldBeColored ? "active" : ""}`}
                    >
                      {step.name}
                    </p>
                  </motion.div>
                );
              })}
            </div>
         
          </>
        )}

        {/* Problem Status Alert - Show if problem status */}
        {orderStatus.startsWith("problem:") && (
          <motion.div
            className="problem-alert"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "20px",
              backgroundColor: "#fff3cd",
              borderRadius: "8px",
              border: "2px solid #ffc107",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ color: "#856404", marginBottom: "10px" }}>
              {problemMessages[orderStatus]}
            </h3>
            <p style={{ color: "#856404", marginBottom: "0" }}>
              For assistance with this order, please contact our support team
              through the chatbot or support form below.
            </p>
          </motion.div>
        )}

        {/* Cards Section */}
        <div className="middle-section">
          {/* Order Items */}
          <motion.div className="card" whileHover={{ y: -8 }}>
            <h3>
              <FaBoxOpen /> Order Items
            </h3>

            <div className="items-table">
              <div className="table-header">
                <div className="col-name">Item</div>
                <div className="col-qty">Quantity</div>
                <div className="col-price">Price</div>
                <div className="col-total">Total</div>
              </div>

              {orderItems.map((item, idx) => {
                const product = products[item.productId];
                const itemTotal = (product?.price || 0) * item.quantity;
                return (
                  <div key={idx} className="table-row">
                    <div className="col-name">{product?.name || "Product"}</div>
                    <div className="col-qty">{item.quantity}</div>
                    <div className="col-price">₹{product?.price || "0"}</div>
                    <div className="col-total">₹{itemTotal}</div>
                  </div>
                );
              })}

              <div className="table-footer">
                <div className="total-label">Grand Total:</div>
                <div className="total-value">₹{order.total}</div>
              </div>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div className="card" whileHover={{ y: -8 }}>
            <h3>
              <FaHome /> Shipping Address
            </h3>
            <p className="address-text">
              {order.deliveryAddress || "Address not provided"}
            </p>
          </motion.div>

          {/* Summary */}
          <motion.div className="card" whileHover={{ y: -8 }}>
            <h3>
              <MdPayment /> Order Summary
            </h3>

            <div className="summary">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">
                  ₹{Math.floor(order.total)}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Tax (5%)</span>
                <span className="summary-value">
                  ₹{tax || "0(Tax-free delivery on bigger orders)"}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">
                  {shipping === 0 ? "Free" : shipping}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Discount</span>
                <span className="summary-value">
                  {discount === 0 ? "None" : "10%"}
                </span>
              </div>

              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span className="summary-label">Total Amount</span>
                <span className="summary-value">
                  ₹{Math.round(order.total + tax + shipping - discount)}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Payment Method</span>
                <span className="summary-value">
                  {formatPaymentMethod(order.paymentMethod)}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Order Status</span>
                <span className="summary-value status-badge">
                  {orderStatus}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Buttons */}
        <div className="actions">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateInvoicePDF}
            disabled={downloadingPDF}
          >
            <FiDownload />{" "}
            {downloadingPDF ? "Generating..." : "Download Invoice"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/Chatbot")}
          >
            <MdSupportAgent /> Get Help
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/Redirect")}
          >
            <FaBoxOpen /> Continue Shopping
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
