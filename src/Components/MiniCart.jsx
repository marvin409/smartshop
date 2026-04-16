import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const MiniCart = () => {
  const { cart, setCart } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="mini-cart">
      <div className="cart-icon" onClick={() => setOpen(!open)}>
        <FaShoppingCart size={24} />
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </div>

      {open && (
        <div className="cart-dropdown">
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cart.slice(0, 3).map((item, idx) => (
                <div key={idx} className="cart-item">
                  {item.name} - KES {item.price}
                </div>
              ))}
              <div className="cart-total">Total: KES {totalAmount.toFixed(2)}</div>
              <button onClick={clearCart} className="clear-btn">Clear Cart</button>
              <Link to="/checkout" className="checkout-btn">Checkout</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniCart;
