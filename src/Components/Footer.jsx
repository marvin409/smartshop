import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-brand premium-footer-brand">
        <span className="footer-kicker">SmartShop Appliances</span>
        <p>Premium appliances, modern home essentials, and concierge-style support for confident online shopping.</p>
        <small>
          Nairobi, Kenya | WhatsApp <a href="https://wa.me/254105443420" target="_blank" rel="noopener noreferrer">+254 105 443 420</a> | Email ochiengmarvin4004@gmail.com
        </small>
      </div>
      <div className="footer-brand premium-footer-brand">
        <span className="footer-kicker">Why shoppers stay</span>
        <p>Cleaner product discovery, richer category storytelling, secure checkout, and premium support from browse to delivery.</p>
        <small>Copyright 2026 SmartShop Appliances. Retail storefront by Marvin Ochieng.</small>
      </div>
      <div className="footer-links premium-footer-links">
        <Link to="/about">About Us</Link>
        <Link to="/terms">Terms & Conditions</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/customer-service">Customer Service</Link>
        <a href="https://instagram.com/nai.raw.b3rry" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://wa.me/254105443420" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    </footer>
  );
};

export default Footer;
