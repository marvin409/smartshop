import React, { useContext, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { jsPDF } from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { CartContext } from "./CartContext";
import { buildApiUrl } from "../utils/api";
import { getStoredUser } from "../utils/auth";
import {
  buildReceiptItems,
  getCartItemTotal,
  getWhatsAppNumber,
  getWhatsAppUrl,
} from "../utils/catalog";

const BRAND_IMAGE = "/brand/appliances-mark.png";

const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  if (digits.startsWith("7") && digits.length === 9) {
    return `254${digits}`;
  }

  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  return digits;
};

const buildOrderItems = (cart) => {
  const grouped = new Map();

  cart.forEach((item) => {
    const productId = Number(item.product_id || item.id);
    if (!productId) {
      return;
    }

    const current = grouped.get(productId) || { product_id: productId, quantity: 0 };
    current.quantity += 1;
    grouped.set(productId, current);
  });

  return Array.from(grouped.values());
};

const fileToDataUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const MpesaPayment = () => {
  const { cart, setCart } = useContext(CartContext);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const receiptRef = useRef(null);

  const receiptItems = useMemo(() => buildReceiptItems(cart), [cart]);
  const totalAmount = cart.reduce((sum, item) => sum + getCartItemTotal(item), 0);
  const receiptPreview = receiptData || {
    orderId: "Pending",
    phone: phone || "07XXXXXXXX",
    items: receiptItems,
    totalAmount,
    issuedAt: new Date().toLocaleString(),
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadInvoice = async () => {
    const previewCanvas = receiptRef.current?.querySelector("canvas");
    const qrDataUrl = previewCanvas ? previewCanvas.toDataURL("image/png") : null;
    const brandDataUrl = await fileToDataUrl(BRAND_IMAGE);
    const doc = new jsPDF();

    doc.setFillColor(11, 22, 48);
    doc.rect(0, 0, 210, 38, "F");
    doc.addImage(brandDataUrl, "PNG", 14, 8, 24, 24);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("SmartShop Appliances Invoice", 45, 22);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(12);
    doc.text(`Order: ${receiptPreview.orderId}`, 14, 52);
    doc.text(`Customer Phone: ${receiptPreview.phone}`, 14, 60);
    doc.text(`Issued: ${receiptPreview.issuedAt}`, 14, 68);

    let y = 82;
    receiptPreview.items.forEach((item, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${item.name}`, 14, y);
      doc.setFontSize(10);
      doc.text(`Qty ${item.quantity} | Catalog ${item.catalog_code}`, 14, y + 6);
      doc.text(`Unit KES ${item.sale_price.toFixed(2)} | Line KES ${item.lineTotal.toFixed(2)}`, 14, y + 12);
      y += 22;
    });

    doc.setFontSize(14);
    doc.text(`Total: KES ${receiptPreview.totalAmount.toFixed(2)}`, 14, y + 8);
    doc.setFontSize(11);
    doc.text(`WhatsApp support: +${getWhatsAppNumber()}`, 14, y + 18);

    if (qrDataUrl) {
      doc.addImage(qrDataUrl, "PNG", 150, 48, 36, 36);
      doc.setFontSize(9);
      doc.text("Scan for WhatsApp", 150, 88);
    }

    doc.save(`smartshop-invoice-${receiptPreview.orderId}.pdf`);
  };

  const handlePayment = async () => {
    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }

    if (totalAmount <= 0) {
      toast.error("Cannot initiate payment with an empty cart");
      return;
    }

    const orderItems = buildOrderItems(cart);
    if (orderItems.length === 0) {
      toast.error("Your cart items are missing product IDs");
      return;
    }

    const formattedPhone = normalizePhone(phone.trim());
    if (!formattedPhone.startsWith("254") || formattedPhone.length !== 12) {
      toast.error("Use a valid Safaricom number like 07XXXXXXXX");
      return;
    }

    const user = getStoredUser();
    const userId = user?.user_id || user?.id || 1;
    const toastId = toast.loading("Processing payment...");
    setIsSubmitting(true);

    try {
      const orderResponse = await axios.post(buildApiUrl("/api/place_order"), {
        user_id: userId,
        items: orderItems,
      });

      const orderId = orderResponse.data?.order_id;
      localStorage.setItem("lastOrderId", String(orderId));

      await axios.post(buildApiUrl("/api/mpesa_payment"), {
        phone: formattedPhone,
        amount: Number(totalAmount.toFixed(0)),
        order_id: orderId,
      });

      setReceiptData({
        orderId,
        phone: formattedPhone,
        items: receiptItems,
        totalAmount,
        issuedAt: new Date().toLocaleString(),
      });

      toast.update(toastId, {
        render: `Payment for order #${orderId} initiated. Check ${formattedPhone} for the STK prompt.`,
        type: "success",
        isLoading: false,
        autoClose: 3500,
      });

      setCart([]);
    } catch (err) {
      console.error("Payment error:", err);
      toast.update(toastId, {
        render: err.response?.data?.error || "Payment failed. Check the backend response.",
        type: "error",
        isLoading: false,
        autoClose: 4500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <div className="form-hero">
        <span className="eyebrow">Checkout</span>
        <h1>Confirm and pay with M-Pesa</h1>
        <p>A branded payment stage with a printable receipt, invoice download, and WhatsApp QR support handoff.</p>
      </div>

      <div className="form-shell payment-shell">
        <div className="form-card form-card-accent">
          <h2>Payment guide</h2>
          <p>Use a Safaricom number in the correct format and confirm the STK push on your phone.</p>

          <div className="payment-highlights">
            <div>
              <strong>Branded receipt</strong>
              <span>Your appliance image now appears on the live receipt and the downloadable invoice.</span>
            </div>
            <div>
              <strong>WhatsApp support</strong>
              <span>Customers can scan the QR code and jump straight to your WhatsApp support line.</span>
            </div>
          </div>
        </div>

        <div className="form-card payment-card">
          <div className="form-heading">
            <h2>M-Pesa Payment</h2>
            <p>Review the cart, confirm the phone number, and send the payment prompt.</p>
          </div>

          {receiptItems.length === 0 && !receiptData ? (
            <div className="empty-state">Your cart is empty.</div>
          ) : (
            <div className="receipt-card" ref={receiptRef}>
              <div className="receipt-brand">
                <img src={BRAND_IMAGE} alt="SmartShop Appliances" className="receipt-brand-image" />
                <div>
                  <strong>SmartShop Appliances</strong>
                  <span>Receipt and invoice preview</span>
                </div>
              </div>

              <div className="receipt-meta">
                <div>
                  <span>Order</span>
                  <strong>{receiptPreview.orderId}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{receiptPreview.phone}</strong>
                </div>
                <div>
                  <span>Issued</span>
                  <strong>{receiptPreview.issuedAt}</strong>
                </div>
              </div>

              <div className="receipt-line-list">
                {receiptPreview.items.map((item) => (
                  <div key={item.productKey} className="receipt-line-item">
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.catalog_code} | Qty {item.quantity}</span>
                    </div>
                    <strong>KES {item.lineTotal.toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              <div className="receipt-total-row">
                <span>Total Amount</span>
                <strong>KES {receiptPreview.totalAmount.toFixed(2)}</strong>
              </div>

              <div className="receipt-support">
                <div>
                  <span>WhatsApp support</span>
                  <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer">
                    +{getWhatsAppNumber()}
                  </a>
                </div>
                <QRCodeCanvas value={getWhatsAppUrl()} size={92} includeMargin />
              </div>
            </div>
          )}

          <div className="payment-total">
            <span>Total Amount</span>
            <strong>KES {receiptPreview.totalAmount.toFixed(2)}</strong>
          </div>

          <label className="field">
            <span>M-Pesa phone number</span>
            <input
              type="text"
              placeholder="07XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <div className="form-actions">
            <button type="button" onClick={handlePayment} className="glow-button" disabled={isSubmitting || receiptPreview.items.length === 0}>
              {isSubmitting ? "Processing..." : "Proceed to Payment"}
            </button>
            <button type="button" className="secondary-button" onClick={handlePrintReceipt} disabled={receiptPreview.items.length === 0}>
              Print Receipt
            </button>
            <button type="button" className="secondary-button" onClick={handleDownloadInvoice} disabled={receiptPreview.items.length === 0}>
              Download Invoice
            </button>
            <Link to="/cart" className="secondary-link-button">Back to Cart</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MpesaPayment;
