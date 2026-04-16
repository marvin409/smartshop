import React, { createContext, useEffect, useMemo, useState } from "react";
import { enrichProduct, getProductKey } from "../utils/catalog";

export const WishlistContext = createContext();
const WISHLIST_STORAGE_KEY = "smartshop_wishlist";

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    const wishlistItem = enrichProduct(product);
    const productKey = getProductKey(wishlistItem);
    setWishlist((currentWishlist) => {
      if (currentWishlist.some((item) => getProductKey(item) === productKey)) {
        return currentWishlist;
      }

      return [...currentWishlist, wishlistItem];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((currentWishlist) =>
      currentWishlist.filter((item) => getProductKey(item) !== String(id))
    );
  };

  const isInWishlist = useMemo(
    () => (id) => wishlist.some((item) => getProductKey(item) === String(id)),
    [wishlist]
  );

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
