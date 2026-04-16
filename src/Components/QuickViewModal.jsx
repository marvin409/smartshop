import React from "react";
import { motion } from "framer-motion";
import { resolveAssetUrl } from "../utils/api";
import { getProductPricing } from "../utils/catalog";

const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const pricing = getProductPricing(product);
  const description = product.description
    || `SmartShop Appliances recommends this ${product.category || "featured"} item for shoppers who want reliable performance with a polished, modern finish.`;

  return (
    <motion.div
      className="quickview-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="quickview-modal"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="close-btn" onClick={onClose}>x</button>
        <img src={resolveAssetUrl(product.image_url)} alt={product.name} className="quickview-img" />
        <h2>{product.name}</h2>
        <p>KES {pricing.currentPrice.toFixed(2)}</p>
        <p>{description}</p>
      </motion.div>
    </motion.div>
  );
};

export default QuickViewModal;
