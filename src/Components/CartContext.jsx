import React, { createContext, useState } from "react";
import { enrichProduct, getProductKey } from "../utils/catalog";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const enrichedProduct = enrichProduct(product);
    setCart((currentCart) => [...currentCart, enrichedProduct]);
  };

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => getProductKey(item) !== String(id)));
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
