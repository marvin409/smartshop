import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CartContext } from "./CartContext";
import LoyaltyPoints from "./LoyaltyPoints";
import { buildApiUrl, resolveAssetUrl } from "../utils/api";
import { enrichProduct } from "../utils/catalog";

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
  if (Number.isNaN(date.getTime())) {
    return "Recent";
  }

  return date.toLocaleString();
};

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { cart } = useContext(CartContext);

  const [productsCount, setProductsCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const totalStockUnits = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const depletedProducts = products.filter((product) => Number(product.stock || 0) <= 0).length;
  const totalInventoryValue = products.reduce(
    (sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0),
    0
  );
  const lowStockProducts = products.filter((product) => {
    const stock = Number(product.stock || 0);
    return stock > 0 && stock <= 3;
  }).length;

  useEffect(() => {
    axios.get(buildApiUrl("/api/products_count"))
      .then((res) => setProductsCount(res.data.count))
      .catch(() => setProductsCount(0));

    axios.get(buildApiUrl("/api/orders_pending"))
      .then((res) => setPendingOrders(res.data.count))
      .catch(() => setPendingOrders(0));

    axios.get(buildApiUrl("/api/recent_activity"))
      .then((res) => setRecentActivity(res.data.activities))
      .catch(() => setRecentActivity([]));

    axios.get(buildApiUrl("/api/products"))
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]));

    axios.get(buildApiUrl("/api/orders"))
      .then((res) => setRecentOrders(Array.isArray(res.data) ? res.data.slice(0, 6) : []))
      .catch(() => setRecentOrders([]));
  }, []);

  const getIcon = (activity) => {
    const text = activity.toLowerCase();
    if (text.includes("product")) return "PR";
    if (text.includes("order")) return "OR";
    if (text.includes("payment")) return "PM";
    return "AC";
  };

  return (
    <div className="dashboard">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Welcome back, {user?.name || "Admin"}.
      </motion.h1>
      <p>Your SmartShop  appliances admin control center.</p>

      <LoyaltyPoints points={250} />

      <motion.section
        className="dashboard-premium-banner"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <span className="inventory-worth-label">Direct order concierge</span>
          <h2>Every customer order now lands here first.</h2>
          <p>
            Product-page orders are captured as live database orders for immediate admin action,
            cleaner tracking, and a more premium fulfillment workflow.
          </p>
        </div>

        <div className="dashboard-premium-metrics">
          <div>
            <span>Live queue</span>
            <strong>{recentOrders.length}</strong>
          </div>
          <div>
            <span>Pending</span>
            <strong>{pendingOrders}</strong>
          </div>
          <div>
            <span>Catalog health</span>
            <strong>{productsCount > 0 ? `${Math.max(0, productsCount - depletedProducts)}/${productsCount}` : "0/0"}</strong>
          </div>
        </div>
      </motion.section>

      <div className="stats">
        <motion.div className="stat-card" whileHover={{ scale: 1.03 }}>Products: {productsCount}</motion.div>
        <motion.div className="stat-card" whileHover={{ scale: 1.03 }}>Units In Stock: {totalStockUnits}</motion.div>
        <motion.div className="stat-card" whileHover={{ scale: 1.03 }}>Pending Orders: {pendingOrders}</motion.div>
        <motion.div className="stat-card" whileHover={{ scale: 1.03 }}>Sold Out Items: {depletedProducts}</motion.div>
        <motion.div className="stat-card" whileHover={{ scale: 1.03 }}>Cart Items: {cart.length}</motion.div>
      </div>

      <motion.section
        className="inventory-worth-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inventory-worth-copy">
          <span className="inventory-worth-label">Store valuation</span>
          <h2>{formatCurrency(totalInventoryValue)}</h2>
          <p>
            This is the estimated total value of all products currently in your database based on
            price multiplied by stock quantity.
          </p>
        </div>

        <div className="inventory-worth-metrics">
          <div className="inventory-worth-metric">
            <span>Products tracked</span>
            <strong>{productsCount}</strong>
          </div>
          <div className="inventory-worth-metric">
            <span>Low stock</span>
            <strong>{lowStockProducts}</strong>
          </div>
          <div className="inventory-worth-metric">
            <span>Units on hand</span>
            <strong>{totalStockUnits}</strong>
          </div>
        </div>
      </motion.section>

      <div className="dashboard-cards">
        <Link to="/add-product" className="card">Add Product</Link>
        <Link to="/cart" className="card">View Cart</Link>
        <Link to="/place-order" className="card">Place Order</Link>
        <Link to="/orders" className="card">Orders Page</Link>
        <Link to="/mpesa" className="card">M-Pesa Payments</Link>
        <Link to="/products" className="card">Browse Products</Link>
        <Link to="/activity-log" className="card">View All Activity</Link>
      </div>

      <section className="dashboard-orders-panel">
        <div className="dashboard-section-heading">
          <div>
            <span className="eyebrow">Order queue</span>
            <h2>Recent customer and admin orders</h2>
          </div>
          <div className="dashboard-action-row">
            <Link to="/orders" className="secondary-button">Open Orders Page</Link>
            <Link to="/place-order" className="secondary-button">Create Manual Order</Link>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="empty-state">No orders have reached the dashboard yet.</div>
        ) : (
          <div className="dashboard-orders-grid">
            {recentOrders.map((order) => (
              <motion.article
                key={order.order_id}
                className="dashboard-order-card"
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <div className="dashboard-order-card-top">
                  <div>
                    <span className="dashboard-order-label">{order.order_source || "Dashboard Order"}</span>
                    <h3>Order #{order.order_id}</h3>
                  </div>
                  <span className={`dashboard-order-status status-${String(order.status || "pending").toLowerCase()}`}>
                    {order.status || "pending"}
                  </span>
                </div>

                <div className="dashboard-order-meta">
                  <div>
                    <span>Customer</span>
                    <strong>{order.customer_name || `User ${order.user_id}`}</strong>
                  </div>
                  <div>
                    <span>Phone</span>
                    <strong>{order.customer_phone || "Not captured"}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong>{formatCurrency(order.amount || order.total_amount)}</strong>
                  </div>
                  <div>
                    <span>Placed</span>
                    <strong>{formatDateTime(order.created_at)}</strong>
                  </div>
                </div>

                {(order.delivery_location || order.delivery_notes) && (
                  <div className="dashboard-order-notes">
                    <strong>{order.delivery_location || "Delivery info"}</strong>
                    <span>{order.delivery_notes || "No extra delivery notes."}</span>
                  </div>
                )}

                <Link to={`/order/${order.order_id}`} className="dashboard-order-link">
                  Open order details
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p>No recent activity found.</p>
        ) : (
          <div className="timeline">
            {recentActivity.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="timeline-dot">{getIcon(item)}</div>
                <div className="timeline-content">
                  <p>{item}</p>
                  <span className="timeline-time">Live activity</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="products-section">
        <h2>Catalog Snapshot</h2>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => {
              const productData = enrichProduct(product);

              return (
              <motion.div key={product.product_id} className="product-card" whileHover={{ scale: 1.02 }}>
                {product.image_url && (
                  <img src={resolveAssetUrl(product.image_url)} alt={product.name} className="product-img" />
                )}
                <div className="product-card-body">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="product-price">KES {parseFloat(product.price).toFixed(2)}</p>
                  <div className="product-micro-details">
                    <span>Code {productData.catalog_code}</span>
                    <span>{productData.brand || "SmartShop Select"}</span>
                  </div>
                  <div className="product-stock-row">
                    <span
                      className={`stock-pill ${
                        Number(product.stock || 0) <= 0
                          ? "sold-out"
                          : Number(product.stock || 0) <= 3
                            ? "low-stock"
                            : "in-stock"
                      }`}
                    >
                      {Number(product.stock || 0) <= 0
                        ? "Sold out"
                        : Number(product.stock || 0) <= 3
                          ? `${product.stock} left`
                          : `${product.stock} in stock`}
                    </span>
                  </div>
                  <p>ID: {product.product_id}</p>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="owner-info">
        <h2>Store Owner</h2>
        <p>Name: Marvin Ochieng</p>
        <p>Email: ochiengmarvin4004@gmail.com</p>
        <p>WhatsApp: +254 100 5443</p>
        <p>Location: Nairobi, Kenya</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
