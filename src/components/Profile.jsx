import React, { useState, useContext, useEffect } from "react";
import NavBar from "./Nav";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const Toast = ({ message, isError }) => {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: isError ? "#ff6b6b" : "#2ecc71",
        color: isError ? "#fff" : "#fff",
        padding: "15px 20px",
        borderRadius: "6px",
        fontSize: "14px",
        zIndex: 9999,
        opacity: 0.9,
        display: "flex",
        alignItems: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {message}
    </div>
  );
};
export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [searchInput, setSearchInput] = useState("");
  const [languageCount, setLanguageCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);

  const showToast = (msg, isError = false, delay = 0) => {
    setTimeout(() => {
      setToastMessage(msg);
      setToastError(isError);

      setTimeout(() => setToastMessage(""), 2000);
    }, delay);
  };

  // Initialize language from localStorage, default to English
  const initializeLanguage = () => {
    return localStorage.getItem("userLanguage") || "English";
  };

  const [originalProfile, setOriginalProfile] = useState({
    name: localStorage.getItem("userName"),
    mobile: localStorage.getItem("userPhone"),
    email: localStorage.getItem("userEmail"),
    address: localStorage.getItem("userAddress"),
    language: initializeLanguage(),
  });
  const [profile, setProfile] = useState({ ...originalProfile });
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const { auth } = useContext(AuthContext);
  const [isLocked, setIsLocked] = useState(false);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoadingOrders(false);
          return;
        }

        const response = await api.get(
          "https://e-commerce-website-backend-d84m.onrender.com/api/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleMobileChange = (e) => {
    const { value } = e.target;
    // Only allow numbers (0-9), plus (+), and space
    const validPhoneRegex = /^[0-9+ ]*$/;

    if (!validPhoneRegex.test(value)) {
      // Show toast for invalid input
      showToast("Only numbers, + symbol, and spaces are allowed", true);
      return;
    }

    // Update the profile with the valid phone number
    setProfile((prev) => ({ ...prev, mobile: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = async () => {
    const isNonEnglish = profile.language !== "English";

    // ⚠️ show warning immediately (but don't block save)
    if (isNonEnglish) {
      showToast("We don't support multiple languages yet.", true);
    }

    setIsSaving(true);

    try {
      const fullName = `${profile.name}`;
      const token = localStorage.getItem("token");

      if (!token) {
        showToast("Session expired. Please login again.", true);
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const response = await fetch(
        "https://e-commerce-website-backend-d84m.onrender.com/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: fullName,
            email: profile.email,
            phone: profile.mobile,
            address: profile.address,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();

      if (data.user) {
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userPhone", data.user.phone);
        localStorage.setItem("userAddress", data.user.address);
      }

      localStorage.setItem("userLanguage", profile.language);

      const updatedProfile = {
        name: data.user.name,
        email: data.user.email,
        mobile: data.user.phone,
        address: data.user.address,
        language: profile.language,
      };

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setIsEditing(false);
      window.dispatchEvent(new Event("authChanged"));

      // ⏳ FIXED delay for better UX
      // show success instantly
      showToast("Profile updated successfully!");

      // keep button locked a bit longer for UX
      setTimeout(() => {
        setIsSaving(false);
        setIsLocked(false);
      }, 1200); // 👈 adjust this (1500–2000 is ideal)
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSaving(false);
      showToast(`Error: ${error.message}`, true);
    }
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
  };

  const handleOrderClick = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />
      <Toast message={toastMessage} isError={toastError} />

      <div className="flipkart-container">
        <main className="main-content">
          <div className="content-header">
            <h1 style={{ textAlign: "center" }}>Account Settings</h1>
            <p style={{ textAlign: "center" }}>
              Edit your personal details and view order history.
            </p>
          </div>

          <div className="content-grid">
            <section className="info-card">
              <div className="card-header-section">
                <h2>Personal Information</h2>
              </div>

              <div className="form-container">
                <div className="form-row">
                  <div className="input-group">
                    <label style={{ marginRight: 80 }}>Full Name</label>
                    <div className="input-wrapper">
                      <svg
                        className="input-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        type="text"
                        name="name"
                        style={{ width: 250 }}
                        value={profile.name}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        placeholder="Enter your first name"
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ marginRight: 50 }}>Mobile Number</label>
                  <div className="input-wrapper">
                    <svg
                      className="input-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <input
                      type="tel"
                      name="mobile"
                      style={{ width: 250 }}
                      pattern="[0-9+ ]+"
                      value={profile.mobile}
                      onChange={handleMobileChange}
                      readOnly={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ marginRight: 95 }}>Email ID</label>
                  <div className="input-wrapper">
                    <svg
                      className="input-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m2 7 10 7 10-7" />
                    </svg>
                    <input
                      type="email"
                      name="email"
                      style={{ width: 250 }}
                      value={profile.email}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ marginRight: 95 }}>Address</label>
                  <div className="input-wrapper">
                    <svg
                      className="input-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <input
                      type="text"
                      name="address"
                      style={{ width: 250 }}
                      value={profile.address}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ marginRight: 32 }}>Preferred Language</label>
                  <div className="input-wrapper">
                    <svg
                      className="input-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                      <path d="M2 12h20" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    {isEditing ? (
                      <select
                        name="language"
                        value={profile.language}
                        onChange={(e) => {
                          handleInputChange(e);
                        }}
                        style={{ width: 200 }}
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Chinese">Chinese</option>
                      </select>
                    ) : (
                      <>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          color="grey"
                          style={{
                            marginLeft: 171,
                            marginTop: 12.23,
                            position: "absolute",
                            left: 0,
                            top: 0,
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 7L10 12L15 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <input
                          type="text"
                          name="language"
                          style={{ width: 200 }}
                          value={profile.language}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="button-group">
                  {!isEditing ? (
                    <button
                      className="btn-primary"
                      onClick={handleEdit}
                      disabled={isSaving}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className="order-history-card">
              <div className="card-header-section">
                <h2>Order History</h2>
              </div>

              <div className="order-list">
                {orders.length > 0 ? (
                  orders.map((order, index) => {
                    // Calculate total price from order products
                    const allProducts = Array.isArray(order.products)
                      ? order.products
                      : [];

                    return (
                      <div
                        key={index}
                        className="order-item"
                        onClick={() => handleOrderClick(order.orderId)}
                      >
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div className="order-details">
                            <h3 style={{ margin: 0 }}>
                              {allProducts.length} item(s) - Order ID:{" "}
                              {order.orderId}
                            </h3>
                            <p
                              className="order-date"
                              style={{ margin: "4px 0" }}
                            >
                              Date:{" "}
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                            <p
                              className="order-price"
                              style={{ margin: "4px 0" }}
                            >
                              Amount: ₹{order.total}
                            </p>
                            <p
                              className="order-status"
                              style={{
                                margin: "4px 0",
                                color: "#2ecc71",
                                fontWeight: "500",
                              }}
                            >
                              Status: {order.status}
                            </p>
                          </div>
                        </div>
                        <svg
                          className="order-arrow"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <svg
                      className="empty-icon"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <p>No order placed yet</p>
                    <button
                      onClick={() => navigate("/Redirect")}
                      style={{
                        marginTop: "15px",
                        padding: "10px 25px",
                        backgroundColor: "#2ecc71",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Shop Now
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button className="btn-primary logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
