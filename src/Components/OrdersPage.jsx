import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { buildApiUrl } from "../utils/api";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatDateTime = (value) => {
  if (!value) {
    return "Recent";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recent" : date.toLocaleString();
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const orderSummary = orders.reduce(
    (summary, order) => {
      const total = Number(order.amount || order.total_amount || 0);
      summary.totalRevenue += total;
      summary.totalOrders += 1;

      if (String(order.status || "").toLowerCase() === "pending") {
        summary.pendingOrders += 1;
      }

      if (order.delivery_location) {
        summary.deliveryProfiles += 1;
      }

      return summary;
    },
    {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      deliveryProfiles: 0,
    }
  );

  useEffect(() => {
    axios
      .get(buildApiUrl("/api/orders"))
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="dashboard orders-page">
      <div className="orders-hero">
        <div className="orders-hero-copy">
          <span className="inventory-worth-label">Fulfillment lounge</span>
          <h1>Premium orders desk</h1>
          <p>
            Every order is presented with customer identity, delivery direction, order source, and commercial value
            in a single database-backed admin view.
          </p>
        </div>

        <div className="orders-hero-metrics">
          <div className="orders-hero-metric">
            <span>Orders</span>
            <strong>{orderSummary.totalOrders}</strong>
          </div>
          <div className="orders-hero-metric">
            <span>Pending</span>
            <strong>{orderSummary.pendingOrders}</strong>
          </div>
          <div className="orders-hero-metric">
            <span>Captured delivery profiles</span>
            <strong>{orderSummary.deliveryProfiles}</strong>
          </div>
          <div className="orders-hero-metric">
            <span>Revenue</span>
            <strong>{formatCurrency(orderSummary.totalRevenue)}</strong>
          </div>
        </div>
      </div>

      <div className="dashboard-section-heading">
        <div>
          <span className="eyebrow">Orders desk</span>
          <h1>Customer orders</h1>
          <p>Every order should show the buyer details, delivery instructions, order value, and fulfillment status in one place.</p>
        </div>
        <Link to="/place-order" className="glow-button">Create Order</Link>
      </div>

      {loading ? (
        <div className="empty-state">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">No orders found.</div>
      ) : (
        <div className="orders-table-shell">
          <div className="orders-table">
            <div className="orders-table-head">
              <span>Order</span>
              <span>Customer</span>
              <span>Phone</span>
              <span>Delivery</span>
              <span>Total</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {orders.map((order, index) => (
              <motion.div
                key={order.order_id}
                className="orders-table-row"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <div>
                  <strong>#{order.order_id}</strong>
                  <span>{formatDateTime(order.created_at)}</span>
                </div>
                <div>
                  <strong>{order.customer_name || `User ${order.user_id}`}</strong>
                  <span className="orders-source-chip">{order.order_source || "Standard order"}</span>
                </div>
                <div>
                  <strong>{order.customer_phone || "Not captured"}</strong>
                  <span>{order.customer_email || "No email"}</span>
                </div>
                <div>
                  <strong>{order.delivery_location || "No delivery location"}</strong>
                  <span>{order.delivery_notes || "No delivery notes"}</span>
                </div>
                <div>
                  <strong>{formatCurrency(order.amount || order.total_amount)}</strong>
                  <span>Order value</span>
                </div>
                <div>
                  <span className={`dashboard-order-status status-${String(order.status || "pending").toLowerCase()}`}>
                    {order.status || "pending"}
                  </span>
                </div>
                <div>
                  <Link to={`/order/${order.order_id}`} className="dashboard-order-link">
                    Open
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
