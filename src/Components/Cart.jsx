import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "./CartContext";
import { resolveAssetUrl } from "../utils/api";
import { buildReceiptItems, getCartItemTotal, getProductKey } from "../utils/catalog";

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const cartItems = useMemo(() => buildReceiptItems(cart), [cart]);
  const totalAmount = cart.reduce((sum, item) => sum + getCartItemTotal(item), 0);

  const removeFromCart = (id) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((item) => getProductKey(item) === String(id));

    if (itemIndex >= 0) {
      updatedCart.splice(itemIndex, 1);
      setCart(updatedCart);
      toast.info("Item removed from cart");
    }
  };

  return (
    <section className="cart-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Your basket</span>
          <h1>Premium cart summary</h1>
          <p className="catalog-subtitle">
            Review each product with its image, description, discount, and live checkout pricing before payment.
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">Your cart is empty.</div>
      ) : (
        <div className="cart-layout">
          <div className="cart-item-list">
            {cartItems.map((item) => (
              <article key={item.productKey} className="cart-item-card">
                <img src={resolveAssetUrl(item.image_url)} alt={item.name} className="cart-item-image" />

                <div className="cart-item-copy">
                  <div className="cart-item-header">
                    <div>
                      <span className="product-badge">{item.category || "featured"}</span>
                      <h3>{item.name}</h3>
                    </div>
                    <button type="button" className="cart-remove-button" onClick={() => removeFromCart(item.productKey)}>
                      Remove one
                    </button>
                  </div>

                  <p>{item.description || "A curated SmartShop product ready for fast checkout."}</p>

                  <div className="cart-item-meta">
                    <span>Qty {item.quantity}</span>
                    <span>{item.discount_percentage}% off</span>
                    <span>Flash sale active</span>
                  </div>

                  <div className="cart-item-pricing">
                    <strong>KES {item.sale_price.toFixed(2)}</strong>
                    <span>KES {item.original_price.toFixed(2)}</span>
                    <p>Line total: KES {item.lineTotal.toFixed(2)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary-card">
            <span className="eyebrow">Checkout ready</span>
            <h2>Order snapshot</h2>

            <div className="cart-summary-row">
              <span>Unique products</span>
              <strong>{cartItems.length}</strong>
            </div>

            <div className="cart-summary-row">
              <span>Total units</span>
              <strong>{cart.length}</strong>
            </div>

            <div className="cart-summary-row">
              <span>Grand total</span>
              <strong>KES {totalAmount.toFixed(2)}</strong>
            </div>

            <p>Your cart now carries the same premium product detail into payment and receipt generation.</p>
            <Link to="/mpesa" className="cart-pay-btn">Proceed to Payment</Link>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Cart;
