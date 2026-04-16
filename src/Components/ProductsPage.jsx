import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import { buildApiUrl } from "../utils/api";
import { enrichProduct, searchCatalog } from "../utils/catalog";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchQuery = params.get("search") || "";
  const categoryQuery = params.get("category") || "all";

  useEffect(() => {
    let active = true;

    axios
      .get(buildApiUrl("/api/products"))
      .then((res) => {
        if (!active) {
          return;
        }

        const catalog = Array.isArray(res.data) ? res.data.map(enrichProduct) : [];
        setProducts(catalog);
      })
      .catch(() => {
        if (active) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    if (!searchQuery && (!categoryQuery || categoryQuery === "all")) {
      return products;
    }

    return searchCatalog(products, searchQuery, categoryQuery);
  }, [products, searchQuery, categoryQuery]);

  return (
    <div className="products-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1>Our Products</h1>
          {(searchQuery || categoryQuery !== "all") && (
            <p className="catalog-subtitle">
              Showing results for {searchQuery ? `"${searchQuery}"` : "all products"} in{" "}
              {categoryQuery === "all" ? "all departments" : categoryQuery}.
            </p>
          )}
        </div>
      </div>

      {loading && <div className="empty-state">Loading catalog...</div>}

      <div className="products-grid">
        {!loading && visibleProducts.length === 0 && (
          <div className="empty-state">No products matched your current search in the catalog.</div>
        )}
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.product_id || product.id || index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
