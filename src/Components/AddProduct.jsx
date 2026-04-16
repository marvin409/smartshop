import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { buildApiUrl } from "../utils/api";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.post(buildApiUrl("/api/add_product"), data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully");

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  return (
    <section className="form-page">
      <div className="form-hero">
        <span className="eyebrow">Admin tools</span>
        <h1>Add a new product</h1>
        <p>Upload clean catalog data, pricing, stock, and imagery using the same premium UI language as the storefront.</p>
      </div>

      <div className="form-shell">
        <div className="form-card form-card-accent">
          <h2>Catalog publishing</h2>
          <p>Keep product names clear, descriptions short, and imagery bright for a stronger marketplace feel.</p>

          <div className="form-feature-list">
            <div>
              <strong>Fast listing</strong>
              <span>Create a polished product card from one form.</span>
            </div>
            <div>
              <strong>Retail-ready</strong>
              <span>The SmartShop appliances store is very ready to serve you.</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-card product-form">
          <div className="form-heading">
            <h2>Product details</h2>
            <p>Everything your shoppers need to trust the listing at a glance.</p>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>Product name</span>
              <input type="text" name="name" placeholder="Smart LED TV 43 inch" value={formData.name} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Price</span>
              <input type="number" name="price" placeholder="34999" value={formData.price} onChange={handleChange} required />
            </label>

            <label className="field field-full">
              <span>Description(brand)</span>
              <textarea name="description" placeholder="Describe the key selling points, features, and benefits." value={formData.description} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Stock quantity</span>
              <input type="number" name="stock" placeholder="25" value={formData.stock} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Product image</span>
              <input type="file" name="image" onChange={handleChange} />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="glow-button">Publish product</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
