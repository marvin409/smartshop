import React, { useState } from "react";
import { Link } from "react-router-dom";

const MegaMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div 
      className="mega-menu"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="mega-btn" onClick={() => setOpen(!open)}>
        🛒 Products
      </button>

      {open && (
        <div className="mega-dropdown">
          <div className="mega-column">
            <h4>Electronics</h4>
            <Link to="/products/phones">Phones</Link>
            <Link to="/products/laptops">Laptops</Link>
            <Link to="/products/accessories">Accessories</Link>
          </div>
          <div className="mega-column">
            <h4>Fashion</h4>
            <Link to="/products/men">Men</Link>
            <Link to="/products/women">Women</Link>
            <Link to="/products/shoes">Shoes</Link>
          </div>
          <div className="mega-column">
            <h4>Home & Living</h4>
            <Link to="/products/furniture">Furniture</Link>
            <Link to="/products/kitchen">Kitchen</Link>
            <Link to="/products/decor">Decor</Link>
          </div>
          <div className="mega-column">
            <h4>Sports</h4>
            <Link to="/products/fitness">Fitness</Link>
            <Link to="/products/outdoor">Outdoor</Link>
            <Link to="/products/gear">Gear</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
