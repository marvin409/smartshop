import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import OrderTracking from "./OrderTracking";
import { buildApiUrl, resolveAssetUrl } from "../utils/api";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(buildApiUrl(`/api/orders/${id}`))
      .then((res) => {
        setOrder(res.data);
        setError("");
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Unable to load this order.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="form-page">Loading order...</div>;
  }

  if (error || !order) {
    return <div className="form-page">{error || "Order not found."}</div>;
  }

  const payment = order.payment || {};
  const trackingStatus = ["pending", "paid", "cancelled", "completed"].includes(order.status)
    ? "placed"
    : order.status;

  return (
    <div className="form-page">
      <div className="form-hero">
        <span className="eyebrow">Order details</span>
        <h1>Order #{order.order_id}</h1>
        <p>Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : "Unknown date"}.</p>
      </div>

      <div className="form-card">
        <p><strong>Total:</strong> KES {Number(order.total_amount || 0).toFixed(2)}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Source:</strong> {order.order_source || "Standard order"}</p>
        <p><strong>Customer:</strong> {order.customer_name || "Customer"}</p>
        <p><strong>Email:</strong> {order.customer_email || "Not available"}</p>
        <p><strong>Phone:</strong> {order.customer_phone || "Not available"}</p>
        <p><strong>Delivery location:</strong> {order.delivery_location || "Not provided"}</p>
        <p><strong>Delivery notes:</strong> {order.delivery_notes || "None"}</p>

        <OrderTracking status={trackingStatus} />

        <h2>Items Ordered</h2>
        {order.items?.length ? (
          order.items.map((item) => (
            <div key={item.item_id} className="order-item">
              <img src={resolveAssetUrl(item.image_url)} alt={item.name} />
              <p>{item.name} x {item.quantity}</p>
              <p>KES {Number(item.price || 0).toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>No items found for this order.</p>
        )}

        <h2>Payment Details</h2>
        <p><strong>Transaction ID:</strong> {payment.transaction_code || "Pending"}</p>
        <p><strong>Payment Status:</strong> {payment.status || "Pending"}</p>
        <p><strong>Amount:</strong> KES {payment.amount ? Number(payment.amount).toFixed(2) : Number(order.total_amount || 0).toFixed(2)}</p>

        <div className="order-actions">
          <Link to="/customer-service">Need Help?</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
