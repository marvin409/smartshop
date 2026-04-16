import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "./WishlistContext";
import { resolveAssetUrl } from "../utils/api";
import { getProductKey, getProductPricing } from "../utils/catalog";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  return (
    <section className="wishlist-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Saved picks</span>
          <h1>Premium wishlist</h1>
          <p className="catalog-subtitle">
            Customers can now save items into a richer wishlist with live pricing, product imagery, and quick return-to-shop actions.
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">No items in your wishlist yet.</div>
      ) : (
        <div className="wishlist-grid premium-wishlist-grid">
          {wishlist.map((item) => {
            const pricing = getProductPricing(item);

            return (
              <article key={getProductKey(item)} className="wishlist-card">
                <img src={resolveAssetUrl(item.image_url)} alt={item.name} className="wishlist-image" />
                <div className="wishlist-card-body">
                  <div className="wishlist-card-topline">
                    <span className="product-badge">{item.category || "featured"}</span>
                    <span className="discount-badge">
                      {pricing.isFlashSaleActive ? `-${item.discount_percentage}%` : "Regular price"}
                    </span>
                  </div>

                  <h3>{item.name}</h3>
                  <p>{item.description || "Saved for later from your SmartShop premium catalog."}</p>

                  <div className="wishlist-pricing">
                    <strong>KES {pricing.currentPrice.toFixed(2)}</strong>
                    {pricing.isFlashSaleActive && <span>KES {pricing.originalPrice.toFixed(2)}</span>}
                  </div>

                  <div className="wishlist-actions">
                    <Link to="/products" className="secondary-link-button">Return to Catalog</Link>
                    <button type="button" onClick={() => removeFromWishlist(getProductKey(item))}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default WishlistPage;
