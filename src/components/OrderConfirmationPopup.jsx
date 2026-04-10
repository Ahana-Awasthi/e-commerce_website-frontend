import React, { useState, useEffect } from "react";
import "./OrderConfirmationPopup.css";

// Popup for COD - Simple confirmation
export const CodConfirmationPopup = ({ orderId, onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          ✕
        </button>
        <div className="popup-body">
          <div className="success-circle">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle
                className="checkmark-circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark-check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
          <h2 className="popup-title">Order Confirmed</h2>
          <div className="popup-order-info">
            <p className="order-id-label">Your Order ID:</p>
            <p className="order-id-value">{orderId}</p>
          </div>
          <p className="popup-message">
            Thank you for your order! It will be delivered soon.
          </p>
          <button className="popup-button" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

// Popup for Card/UPI/Net Banking - With animation
export const PaymentProcessingPopup = ({ orderId, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const steps = [
    { label: "Payment Done", dot: true },
    { label: "Processing", dot: true },
    { label: "Waiting for Confirmation", dot: true },
    { label: "Order Confirmed", dot: true },
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      // Animation complete, show confirmation popup
      setTimeout(() => {
        setShowConfirmation(true);
      }, 500);
    }
  }, [currentStep, steps.length]);

  if (showConfirmation) {
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <button className="popup-close" onClick={onClose}>
            ✕
          </button>
          <div className="popup-body">
            <div className="success-circle">
              <svg className="checkmark" viewBox="0 0 52 52">
                <circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark-check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
            <h2 className="popup-title">Order Confirmed</h2>
            <div className="popup-order-info">
              <p className="order-id-label">Your Order ID:</p>
              <p className="order-id-value">{orderId}</p>
            </div>
            <p className="popup-message">
              Thank you for your order! It will be delivered soon.
            </p>
            <button className="popup-button" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-body">
          <h2 className="popup-title">Processing Payment</h2>
          <div className="payment-steps">
            {steps.map((step, index) => (
              <div key={index} className="payment-step">
                <div
                  className={`step-dot ${
                    index < currentStep
                      ? "completed"
                      : index === currentStep
                        ? "active"
                        : ""
                  }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <div className="step-content">
                  <p
                    className={`step-label ${index <= currentStep ? "active" : ""}`}
                  >
                    {step.label}
                  </p>
                  {index < currentStep && (
                    <div className="step-connector"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
