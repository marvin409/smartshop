import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart, FaShieldAlt, FaTruck } from "react-icons/fa";
import QuickViewModal from "./QuickViewModal";
import { CartContext } from "./CartContext";
import { WishlistContext } from "./WishlistContext";
import { buildApiUrl, resolveAssetUrl } from "../utils/api";
import { enrichProduct, getFlashSaleState, getProductKey, getProductPricing } from "../utils/catalog";

const DELIVERY_OPTIONS = [
  "Nairobi CBD",
  "Westlands",
  "Kilimani",
  "Kasarani",
  "Thika Road",
  "Mombasa Road",
  "Ngong Road",
  "Rongai",
  "Kiambu",
  "Other",
];

const createEmptyOrderForm = () => ({
  customerName: "",
  customerPhone: "",
  quantity: 1,
  deliveryLocation: "",
  otherLocation: "",
  deliveryNotes: "",
});

const ProductCard = ({ product }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSendingOrder, setIsSendingOrder] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [orderForm, setOrderForm] = useState(createEmptyOrderForm);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const productData = useMemo(() => enrichProduct(product), [product]);
  const pricing = useMemo(() => getProductPricing(productData), [productData]);
  const productKey = getProductKey(productData);
  const stock = Number(product.stock || 0);
  const isSoldOut = stock <= 0;
  const isLowStock = stock > 0 && stock <= 3;
  const wished = isInWishlist(productKey);
  const trustNote = isSoldOut
    ? "Restock alerts available through support"
    : "Ready for secure checkout and support follow-up";

  useEffect(() => {
    const updateCountdown = () => {
      const flashSaleState = getFlashSaleState(productData);
      const targetDate = flashSaleState.isActive
        ? flashSaleState.saleEndsAt.getTime()
        : flashSaleState.nextSaleStartsAt.getTime();
      const remaining = Math.max(0, targetDate - Date.now());
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeLeft(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, [productData]);

  const handleAddToCart = () => {
    if (isSoldOut) {
      toast.error(`${productData.name} is currently sold out`);
      return;
    }

    addToCart(productData);
    toast.success(`${productData.name} added to cart`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleWishlistToggle = () => {
    if (wished) {
      removeFromWishlist(productKey);
      toast.info(`${productData.name} removed from wishlist`);
      return;
    }

    addToWishlist(productData);
    toast.success(`${productData.name} saved to wishlist`);
  };

  const handleOrderFieldChange = (field, value) => {
    setOrderForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const closeOrderForm = () => {
    setShowOrderForm(false);
    setIsSendingOrder(false);
    setOrderForm(createEmptyOrderForm());
  };

  const handleDirectOrder = async (event) => {
    event.preventDefault();

    const deliveryLocation = orderForm.deliveryLocation === "Other"
      ? orderForm.otherLocation.trim()
      : orderForm.deliveryLocation;

    if (!orderForm.customerName.trim()) {
      toast.error("Enter your name before sending the order request.");
      return;
    }

    if (!orderForm.customerPhone.trim()) {
      toast.error("Enter your phone number before sending the order request.");
      return;
    }

    if (!deliveryLocation) {
      toast.error("Choose the delivery location before sending the order request.");
      return;
    }

    setIsSendingOrder(true);

    try {
      const response = await axios.post(buildApiUrl("/api/product_order_request"), {
        product_id: productData.product_id,
        product_name: productData.name,
        quantity: Number(orderForm.quantity) || 1,
        customer_name: orderForm.customerName.trim(),
        customer_phone: orderForm.customerPhone.trim(),
        delivery_location: deliveryLocation,
        delivery_notes: orderForm.deliveryNotes.trim(),
        price: pricing.currentPrice.toFixed(2),
      });

      toast.success(response.data?.message || "Order sent to SmartShop.");
      if (response.data?.order_id) {
        toast.info(`Order #${response.data.order_id} is now in the admin dashboard.`, {
          autoClose: 5000,
        });
      }
      closeOrderForm();
    } catch (error) {
      toast.error(
        error.response?.data?.error
        || error.response?.data?.message
        || error.message
        || `Unable to send the order request${error.response?.status ? ` (${error.response.status})` : ""}.`
      );
    } finally {
      setIsSendingOrder(false);
    }
  };

  return (
    <>
      <div className="product-card">
        <button type="button" className={`wishlist-toggle ${wished ? "active" : ""}`} onClick={handleWishlistToggle}>
          {wished ? <FaHeart /> : <FaRegHeart />}
        </button>
        <img
          src={resolveAssetUrl(productData.image_url)}
          alt={productData.name}
          className="product-img"
        />
        <div className="product-card-body">
          <div className="product-card-topline">
            <span className="product-badge">{productData.category || "featured"}</span>
            <span className="discount-badge">
              {pricing.isFlashSaleActive ? `-${productData.discount_percentage}%` : `Flash ${productData.discount_percentage}%`}
            </span>
          </div>
          <h3>{productData.name}</h3>
          <div className="flash-sale-timer">
            <span>{pricing.isFlashSaleActive ? "Flash sale ends in" : "Flash sale returns in"}</span>
            <strong>{timeLeft}</strong>
          </div>
          <div className="product-stock-row">
            <span className={`stock-pill ${isSoldOut ? "sold-out" : isLowStock ? "low-stock" : "in-stock"}`}>
              {isSoldOut ? "Sold out" : isLowStock ? `${stock} left` : `${stock} in stock`}
            </span>
            {isLowStock && <span className="stock-hint">Fast moving</span>}
          </div>
          <div className="product-price-block">
            <p className="product-price">KES {pricing.currentPrice.toFixed(2)}</p>
            {pricing.isFlashSaleActive ? (
              <>
                <p className="product-original-price">KES {pricing.originalPrice.toFixed(2)}</p>
                <p className="product-savings">Save KES {pricing.savings.toFixed(2)}</p>
              </>
            ) : (
              <p className="product-savings">Regular price is active now</p>
            )}
          </div>
          <div className="product-order-cta">
            <button
              type="button"
              className="glow-button product-order-button"
              onClick={() => setShowOrderForm(true)}
              disabled={isSoldOut}
            >
              {isSoldOut ? "Unavailable" : "Order This Product"}
            </button>
            <span>Submit the product directly into the SmartShop admin dashboard with delivery details attached.</span>
          </div>
          <div className="product-actions">
            <button onClick={handleAddToCart} disabled={isSoldOut}>
              {isSoldOut ? "Notify Me Soon" : "Add to Cart"}
            </button>
            <button type="button" className="secondary-button" onClick={() => setShowQuickView(true)}>
              {wished ? "Saved Item" : "Quick View"}
            </button>
          </div>
          <div className="product-service-row">
            <span><FaTruck /> Delivery-ready</span>
            <span><FaShieldAlt /> {trustNote}</span>
          </div>
        </div>

        {showQuickView && (
          <QuickViewModal
            product={productData}
            onClose={() => setShowQuickView(false)}
          />
        )}
      </div>

      {showOrderForm && (
        <div className="product-order-modal-backdrop" onClick={closeOrderForm}>
          <div
            className="product-order-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`product-order-title-${productKey}`}
          >
            <div className="product-order-modal-header">
              <div>
                <span className="eyebrow">Direct Order</span>
                <h3 id={`product-order-title-${productKey}`}>{productData.name}</h3>
                <p>Choose the delivery location and push this order straight into the live SmartShop admin queue.</p>
              </div>
              <button type="button" className="secondary-button product-order-close" onClick={closeOrderForm}>
                Close
              </button>
            </div>

            <form className="product-order-form" onSubmit={handleDirectOrder}>
              <label className="field">
                <span>Your name</span>
                <input
                  type="text"
                  value={orderForm.customerName}
                  onChange={(event) => handleOrderFieldChange("customerName", event.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <label className="field">
                <span>Your phone number</span>
                <input
                  type="text"
                  value={orderForm.customerPhone}
                  onChange={(event) => handleOrderFieldChange("customerPhone", event.target.value)}
                  placeholder="07XXXXXXXX"
                  required
                />
              </label>

              <div className="field-group">
                <label className="field">
                  <span>Quantity</span>
                  <input
                    type="number"
                    min="1"
                    value={orderForm.quantity}
                    onChange={(event) => handleOrderFieldChange("quantity", event.target.value)}
                    required
                  />
                </label>

                <label className="field">
                  <span>Delivery location</span>
                  <select
                    value={orderForm.deliveryLocation}
                    onChange={(event) => handleOrderFieldChange("deliveryLocation", event.target.value)}
                    required
                  >
                    <option value="">Select location</option>
                    {DELIVERY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {orderForm.deliveryLocation === "Other" && (
                <label className="field">
                  <span>Exact delivery location</span>
                  <input
                    type="text"
                    value={orderForm.otherLocation}
                    onChange={(event) => handleOrderFieldChange("otherLocation", event.target.value)}
                    placeholder="Estate, town, landmark, or area"
                    required
                  />
                </label>
              )}

              <label className="field">
                <span>Delivery notes</span>
                <textarea
                  value={orderForm.deliveryNotes}
                  onChange={(event) => handleOrderFieldChange("deliveryNotes", event.target.value)}
                  placeholder="Optional notes for house number, stage, or landmark"
                />
              </label>

              <div className="product-order-summary">
                <strong>KES {pricing.currentPrice.toFixed(2)}</strong>
                <span>Instantly visible on the admin dashboard</span>
              </div>

              <div className="form-actions">
                <button type="submit" className="glow-button" disabled={isSendingOrder}>
                  {isSendingOrder ? "Submitting Order..." : "Submit Order"}
                </button>
                <button type="button" className="secondary-button" onClick={closeOrderForm} disabled={isSendingOrder}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
