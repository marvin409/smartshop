import React from "react";
import { FaClipboardList, FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";

const OrderTracking = ({ status }) => {
  const steps = [
    { id: "placed", label: "Order Placed", icon: <FaClipboardList /> },
    { id: "packed", label: "Packed", icon: <FaBox /> },
    { id: "shipped", label: "Shipped", icon: <FaTruck /> },
    { id: "delivered", label: "Delivered", icon: <FaCheckCircle /> },
  ];

  const currentIndex = steps.findIndex((step) => step.id === status);

  return (
    <div className="order-tracking">
      {steps.map((step, index) => (
        <div key={step.id} className={`tracking-step ${index <= currentIndex ? "active" : ""}`}>
          <div className="step-icon">{step.icon}</div>
          <p>{step.label}</p>
          {index < steps.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );
};

export default OrderTracking;
