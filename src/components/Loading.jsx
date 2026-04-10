// Loading.jsx
import React from "react";

const spinnerStyle = {
  width: "80px",
  height: "80px",
  border: "10px solid #f3f3f3",
  borderTop: "10px solid #007bff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "50px auto",
};

const textStyle = {
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#333",
  marginTop: "20px",
  marginBottom: "50px",
};

export default function Loading({
  message = "Loading, please wait...",
}) {
  return (
    <div>
      <div style={spinnerStyle} />
      <h1 style={textStyle}>{message}</h1>

      {/* keyframes for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
