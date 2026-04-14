import React, { useState, useEffect, useContext } from "react";
import NavBar from "./Nav";
import "./CheckoutPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  CodConfirmationPopup,
  PaymentProcessingPopup,
} from "./OrderConfirmationPopup";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, createOrder, auth } = useContext(AuthContext);
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState([]);
  const [cartQuantityMap, setCartQuantityMap] = useState({});
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderTotalAmount, setOrderTotalAmount] = useState(0);

  // Delivery address state
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: localStorage.getItem("userName") || "",
    phone: localStorage.getItem("userPhone") || "",
    address: localStorage.getItem("userAddress") || "123 Main St",
    city: localStorage.getItem("userAddress")?.split(",")[0] || "",
    state: localStorage.getItem("userAddress")?.split(",")[1]?.trim() || "",
  });

  const [editedAddress, setEditedAddress] = useState({ ...deliveryAddress });

  // Initialize quantity map from context cart
  useEffect(() => {
    const qtyMap = {};
    cart.forEach((item) => {
      if (Array.isArray(item) && item.length >= 2) {
        qtyMap[item[0]] = parseInt(item[1]) || 1;
      }
    });
    setCartQuantityMap(qtyMap);
  }, [cart]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://e-commerce-website-backend-d84m.onrender.com/api/products");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Map cart data to product objects with quantities
  const cartProducts = products
    .filter((p) => cart.some((item) => item[0] === p._id.toString()))
    .map((p) => ({
      ...p,
      qty: cartQuantityMap[p._id.toString()] || 1,
    }));

  // Calculate totals
  const totalItems = cartProducts.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartProducts.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const totalOriginalPrice = cartProducts.reduce(
    (sum, item) => sum + item.mrp * item.qty || item.price * item.qty,
    0,
  );
  const discount = totalOriginalPrice - totalPrice;
  const deliveryCharges = totalPrice > 1000 ? 0 : 40;
  const platformFee = 3;
  const totalAmount = totalPrice + deliveryCharges + platformFee;

  // Estimated delivery date (7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleEditAddress = () => {
    setEditedAddress({ ...deliveryAddress });
    setIsEditing(true);
  };

  const handleSaveAddress = async () => {
    setIsSaving(true);
    try {
      const fullAddress = `${editedAddress.city}, ${editedAddress.state}`;
      await axios.put(
        "https://e-commerce-website-backend-d84m.onrender.com/api/profile",
        {
          name: editedAddress.fullName,
          phone: editedAddress.phone,
          address: fullAddress,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );

      // Update localStorage
      localStorage.setItem("userName", editedAddress.fullName);
      localStorage.setItem("userPhone", editedAddress.phone);
      localStorage.setItem("userAddress", fullAddress);

      setDeliveryAddress(editedAddress);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating address:", err);
      alert("Failed to update address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedAddress({ ...deliveryAddress });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (cartProducts.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const orderProducts = cartProducts.map((p) => ({
        productId: p._id,
        quantity: p.qty,
      }));

      const fullAddress = `${deliveryAddress.city}, ${deliveryAddress.state}`;

      const orderData = {
        products: orderProducts,
        total: totalAmount,
        paymentMethod: selectedPayment,
        deliveryAddress: fullAddress,
      };

      const res = await createOrder(orderData);
      setOrderId(res.orderId);
      setOrderTotalAmount(totalAmount);

      // Show appropriate popup based on payment method
      if (selectedPayment === "cod") {
        setShowConfirmation("cod");
      } else {
        setShowConfirmation("payment");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <>
        <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
        <div style={{ padding: "40px", textAlign: "center" }}>
          Loading checkout...
        </div>
      </>
    );
  }

  // Show confirmation popup if order was just placed
  if (showConfirmation === "cod") {
    return (
      <>
        <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
        <CodConfirmationPopup
          orderId={orderId}
          totalAmount={orderTotalAmount}
          onClose={handleConfirmationClose}
        />
      </>
    );
  }

  if (showConfirmation === "payment") {
    return (
      <>
        <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
        <PaymentProcessingPopup
          orderId={orderId}
          totalAmount={orderTotalAmount}
          onClose={handleConfirmationClose}
        />
      </>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <>
        <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>Your cart is empty</h2>
          <button
            onClick={() => navigate("/Redirect")}
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
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <div className="checkout-page">
        {/* Header */}
        <header className="checkout-header">
          <div className="header-content">
            <div className="logo">
              <h1>Shopora Checkout</h1>
            </div>
            <div className="progress-indicator">
              <div className="progress-step completed">
                <div className="step-number">✓</div>
                <div className="step-label">Cart</div>
              </div>
              <div className="progress-step active">
                <div className="step-number">2</div>
                <div className="step-label">Checkout</div>
              </div>
              <div className="progress-step">
                <div className="step-number">3</div>
                <div className="step-label">Payment</div>
              </div>
            </div>
            <div className="header-spacer"></div>
          </div>
        </header>

        {/* Main Content */}
        <div className="checkout-container">
          <div className="checkout-content">
            {/* Left Section */}
            <div className="checkout-left">
              {/* Delivery Address */}
              <div className="section-card">
                <div className="section-header">
                  <h2 className="section-title">Delivery Address</h2>
                </div>
                <div className="address-box">
                  <div className="address-placeholder">
                    <div className="placeholder-field">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={
                          isEditing
                            ? editedAddress.fullName
                            : deliveryAddress.fullName
                        }
                        onChange={(e) =>
                          isEditing &&
                          handleInputChange("fullName", e.target.value)
                        }
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="placeholder-field">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        value={
                          isEditing ? editedAddress.phone : deliveryAddress.phone
                        }
                        onChange={(e) =>
                          isEditing && handleInputChange("phone", e.target.value)
                        }
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="placeholder-field full">
                      <label>Address Line</label>
                      <input
                        type="text"
                        value={
                          isEditing
                            ? editedAddress.address
                            : deliveryAddress.address
                        }
                        onChange={(e) =>
                          isEditing &&
                          handleInputChange("address", e.target.value)
                        }
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="placeholder-row">
                      <div className="placeholder-field">
                        <label>City</label>
                        <input
                          type="text"
                          value={
                            isEditing
                              ? editedAddress.city
                              : deliveryAddress.city
                          }
                          onChange={(e) =>
                            isEditing && handleInputChange("city", e.target.value)
                          }
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="placeholder-field">
                        <label>State</label>
                        <input
                          type="text"
                          value={
                            isEditing
                              ? editedAddress.state
                              : deliveryAddress.state
                          }
                          onChange={(e) =>
                            isEditing && handleInputChange("state", e.target.value)
                          }
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="address-button-group">
                  {!isEditing ? (
                    <button
                      className="change-address-btn"
                      onClick={handleEditAddress}
                    >
                      Change Details
                    </button>
                  ) : (
                    <>
                      <button
                        className="change-address-btn save-btn"
                        onClick={handleSaveAddress}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        className="change-address-btn cancel-btn"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="section-card">
                <div className="section-header">
                  <h2 className="section-title">
                    Order Summary ({totalItems} items)
                  </h2>
                  <div className="delivery-info">
                    <span className="delivery-icon">🚚</span>
                    <span>
                      Estimated Delivery: <strong>{formattedDate}</strong>
                    </span>
                  </div>
                </div>
                <div className="order-items-list">
                  {cartProducts.map((item) => (
                    <div key={item._id} className="product-card">
                      <div className="product-image-wrapper">
                        <img
                          src={item.imageUrl || "/placeholder.png"}
                          alt={item.name}
                          className="product-image"
                        />
                      </div>
                      <div className="product-details">
                        <h3 className="product-name">{item.name}</h3>
                        <p className="product-description">
                          {item.description}
                        </p>
                        <div className="product-pricing">
                          <div className="price-section">
                            <span className="current-price">
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                            {item.mrp && (
                              <>
                                <span className="original-price">
                                  ₹{item.mrp.toLocaleString("en-IN")}
                                </span>
                                <span className="discount-badge">
                                  {Math.round(
                                    ((item.mrp - item.price) / item.mrp) * 100,
                                  )}
                                  % OFF
                                </span>
                              </>
                            )}
                          </div>
                          <div className="quantity-section">
                            <span className="quantity-label">Qty: {item.qty}</span>
                            <span className="item-total">
                              ₹
                              {(item.price * item.qty).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Options */}
              <div className="section-card">
                <div className="section-header">
                  <h2 className="section-title">Payment Options</h2>
                </div>
                <div className="payment-options">
                  <div
                    className={`payment-method ${
                      selectedPayment === "card" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedPayment("card")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={() => setSelectedPayment("card")}
                    />
                    <div className="payment-icon">💳</div>
                    <div className="payment-info">
                      <div className="payment-name">Credit / Debit Card</div>
                      <div className="payment-desc">
                        Visa, Mastercard, Amex, Rupay
                      </div>
                    </div>
                  </div>

                  <div
                    className={`payment-method ${
                      selectedPayment === "upi" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedPayment("upi")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={selectedPayment === "upi"}
                      onChange={() => setSelectedPayment("upi")}
                    />
                    <div className="payment-icon">📱</div>
                    <div className="payment-info">
                      <div className="payment-name">UPI</div>
                      <div className="payment-desc">
                        Google Pay, PhonePe, Paytm
                      </div>
                    </div>
                  </div>

                  <div
                    className={`payment-method ${
                      selectedPayment === "netbanking" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedPayment("netbanking")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="netbanking"
                      checked={selectedPayment === "netbanking"}
                      onChange={() => setSelectedPayment("netbanking")}
                    />
                    <div className="payment-icon">🏦</div>
                    <div className="payment-info">
                      <div className="payment-name">Net Banking</div>
                      <div className="payment-desc">
                        All major banks supported
                      </div>
                    </div>
                  </div>

                  <div
                    className={`payment-method ${
                      selectedPayment === "cod" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedPayment("cod")}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={selectedPayment === "cod"}
                      onChange={() => setSelectedPayment("cod")}
                    />
                    <div className="payment-icon">💵</div>
                    <div className="payment-info">
                      <div className="payment-name">Cash on Delivery</div>
                      <div className="payment-desc">Pay when you receive</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="checkout-right">
              <div className="price-details-card">
                <h2 className="price-title">Price Details</h2>
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Price ({totalItems} items)</span>
                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  {discount > 0 && (
                    <div className="price-row discount-row">
                      <span>Discount</span>
                      <span className="discount-value">
                        − ₹{discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="price-row">
                    <span>Delivery Charges</span>
                    <span
                      className={deliveryCharges === 0 ? "free-delivery" : ""}
                    >
                      {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
                    </span>
                  </div>
                  <div className="price-row">
                    <span>Platform Fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="price-divider"></div>
                  <div className="price-row total-row">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                {discount > 0 && (
                  <div className="savings-badge">
                    You will save ₹{discount.toLocaleString("en-IN")} on this
                    order
                  </div>
                )}
                <button className="place-order-btn" onClick={handlePlaceOrder}>
                  PLACE ORDER
                </button>
                <div className="secure-badge">
                  <span className="lock-icon">🔒</span>
                  <span>Safe and Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Popups */}
      {showConfirmation === "cod" && (
        <CodConfirmationPopup
          orderId={orderId}
          onClose={handleConfirmationClose}
        />
      )}
      {showConfirmation === "payment" && (
        <PaymentProcessingPopup
          orderId={orderId}
          onClose={handleConfirmationClose}
        />
      )}
    </>
  );
}
