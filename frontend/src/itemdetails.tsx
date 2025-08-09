import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ItemDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // We expect details passed via navigation state
  const { itemCode, itemName, itemDescription, price } = location.state || {};

  if (!itemCode) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>No item selected</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ color: "#0d6efd" }}>Item Details</h1>
      <div
        style={{
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <p>
          <strong>Item Code:</strong> {itemCode}
        </p>
        <p>
          <strong>Name:</strong> {itemName}
        </p>
        <p>
          <strong>Description:</strong> {itemDescription}
        </p>
        <p>
          <strong>Price:</strong> ${price}
        </p>
      </div>
      <button
        style={{
          marginTop: "15px",
          padding: "8px 16px",
          background: "#0d6efd",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
        onClick={() => navigate("/")}
      >
        Back
      </button>
    </div>
  );
};

export default ItemDetails;
