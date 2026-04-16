import React, { useEffect, useState } from "react";
import axios from "axios";
import { buildApiUrl, resolveAssetUrl } from "../utils/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(buildApiUrl("/api/products"))
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error("Unexpected response:", res.data);
          setProducts([]);
        }
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setProducts([]);
      });
  }, []);

  return (
    <div className="product-grid">
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map(product => (
          <div key={product.product_id} className="product-card">
            <img src={resolveAssetUrl(product.image_url)} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <strong>KES {product.price}</strong>
            <button>Add to Cart</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
