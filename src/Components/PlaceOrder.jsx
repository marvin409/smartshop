import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { buildApiUrl } from "../utils/api";
import { enrichProduct, getCatalogCode, getProductPricing } from "../utils/catalog";

const createEmptyLine = () => ({ product_id: "", quantity: 1, search: "" });

const PlaceOrder = () => {
  const [userId, setUserId] = useState("");
  const [items, setItems] = useState([createEmptyLine()]);
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(buildApiUrl("/api/products"))
      .then((res) => setProducts(Array.isArray(res.data) ? res.data.map(enrichProduct) : []))
      .catch(() => setProducts([]));
  }, []);

  const productLookup = useMemo(() => {
    return new Map(
      products.flatMap((product) => [
        [String(product.product_id), product],
        [String(getCatalogCode(product)).toUpperCase(), product],
      ])
    );
  }, [products]);

  const updateLine = (index, updates) => {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...updates } : item))
    );
  };

  const handleSearchChange = (index, value) => {
    const normalized = value.trim().toUpperCase();
    const matchedProduct = productLookup.get(normalized);

    updateLine(index, {
      search: value,
      product_id: matchedProduct ? String(matchedProduct.product_id) : "",
    });
  };

  const addLineItem = () => {
    setItems((currentItems) => [...currentItems, createEmptyLine()]);
  };

  const removeLineItem = (index) => {
    setItems((currentItems) => currentItems.filter((_, itemIndex) => itemIndex !== index));
  };

  const lineSummaries = items.map((item) => {
    const key = item.product_id || item.search.trim().toUpperCase();
    const product = productLookup.get(String(key).toUpperCase()) || productLookup.get(String(item.product_id));
    return {
      item,
      product,
      total:
        product && Number(item.quantity) > 0
          ? getProductPricing(product).currentPrice * Number(item.quantity)
          : 0,
    };
  });

  const estimatedTotal = lineSummaries.reduce((sum, line) => sum + line.total, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedItems = items
      .map((item) => {
        const product = productLookup.get(item.search.trim().toUpperCase()) || productLookup.get(String(item.product_id));
        if (!product) {
          return null;
        }

        return {
          product_id: product.product_id,
          quantity: Number(item.quantity) || 1,
        };
      })
      .filter(Boolean);

    if (!userId.trim()) {
      toast.error("Enter a customer ID before placing the order");
      return;
    }

    if (normalizedItems.length === 0) {
      toast.error("Add at least one valid product ID or catalog code");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(buildApiUrl("/api/place_order"), {
        user_id: userId,
        items: normalizedItems,
      });

      toast.success(`Order placed successfully. ID: ${res.data.order_id}`);
      setUserId("");
      setItems([createEmptyLine()]);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <div className="form-hero">
        <span className="eyebrow">Order entry</span>
        <h1>Create an order manually</h1>
        <p>Use product IDs or SmartShop catalog codes to build a cleaner manual order with stronger admin visibility.</p>
      </div>

      <div className="form-shell">
        <div className="form-card form-card-accent">
          <h2>Manual order assistant</h2>
          <p>Admins can now search with the database ID or the separate SmartShop catalog code shown on the dashboard.</p>

          <div className="payment-highlights">
            <div>
              <strong>Flexible lookup</strong>
              <span>Search with IDs like `15` or catalog codes like `SS-0A12BC`.</span>
            </div>
            <div>
              <strong>Live estimate</strong>
              <span>See the running total before you submit the order to the backend.</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-card order-form premium-order-form">
          <div className="form-heading">
            <h2>Order details</h2>
            <p>Match products quickly, verify quantities, and send a more polished order record.</p>
          </div>

          <div className="form-grid">
            <label className="field field-full">
              <span>Customer ID</span>
              <input placeholder="Customer ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
            </label>
          </div>

          <div className="order-line-list">
            {items.map((item, idx) => {
              const summary = lineSummaries[idx];

              return (
                <div key={idx} className="order-line-card">
                  <div className="field-group field-full">
                    <label className="field">
                      <span>Product ID or Catalog Code</span>
                      <input
                        placeholder="e.g. 12 or SS-AB12CD"
                        value={item.search}
                        onChange={(e) => handleSearchChange(idx, e.target.value)}
                      />
                    </label>

                    <label className="field">
                      <span>Quantity</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => updateLine(idx, { quantity: e.target.value })}
                      />
                    </label>
                  </div>

                  {summary.product ? (
                    <div className="order-line-preview">
                      <div>
                        <strong>{summary.product.name}</strong>
                        <span>
                          DB ID {summary.product.product_id} | Catalog {summary.product.catalog_code}
                        </span>
                      </div>
                      <div>
                        <strong>KES {summary.total.toFixed(2)}</strong>
                        <span>{summary.product.discount_percentage}% flash offer scheduled</span>
                      </div>
                    </div>
                  ) : (
                    <div className="order-line-preview muted">
                      <span>Enter a valid product ID or SmartShop catalog code to preview the item.</span>
                    </div>
                  )}

                  {items.length > 1 && (
                    <button type="button" className="secondary-button order-line-remove" onClick={() => removeLineItem(idx)}>
                      Remove line
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={addLineItem}>
              Add another line
            </button>
            <div className="order-total-chip">Estimated total: KES {estimatedTotal.toFixed(2)}</div>
          </div>

          <div className="form-actions">
            <button type="submit" className="glow-button" disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PlaceOrder;
