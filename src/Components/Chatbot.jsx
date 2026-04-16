import React, { useEffect, useRef, useState } from "react";
import { FaBolt, FaHeadset, FaPaperPlane, FaReceipt, FaRobot, FaTimes } from "react-icons/fa";
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const starterMessages = [
  {
    from: "bot",
    text: "Welcome to SmartShop concierge. I can help with payments, orders, support, and product guidance.",
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bodyRef = useRef(null);

  const pushMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const toggleChat = () => {
    setIsOpen((current) => !current);
  };

  const botReplyFor = (value) => {
    const text = value.toLowerCase();

    if (text.includes("payment") || text.includes("mpesa")) {
      return "Use the payment status shortcut below or open the M-Pesa page to confirm the latest order update.";
    }
    if (text.includes("Hello") || text.includes("Hi") || text.includes("Hey")) {
      return "Hello! I am your SmartShop concierge, here to assist you with payments, orders, support, and product guidance.";
    }
    if (text.includes("product") || text.includes("stock") || text.includes("inventory")) {
      return "I can provide details on product availability and stock levels. Ask me about any product in your store.";
    }
    if (text.includes("habari") || text.includes("jambo") || text.includes("mambo")) {
      return "Habari! I am your SmartShop concierge, here to assist you with payments, orders, support, and product guidance.";
    }
    if (text.includes("order")) {
      return "I can surface the latest orders from your backend. Tap the orders shortcut and I will fetch the newest entries.";
    }

    if (text.includes("delivery") || text.includes("shipping")) {
      return "SmartShop is set up to move shoppers quickly from discovery to checkout. Add delivery timing details in support to build even more trust.";
    }
    if (text.includes("buy") || text.includes("checkout") || text.includes("purchase")) {
      return "I can guide shoppers to the checkout page or provide product recommendations to help close the sale.";
    }
    if (text.includes("support") || text.includes("help") || text.includes("whatsapp")) {
      return "Support is one tap away. I can open your WhatsApp support line or guide shoppers to the customer service page.";
    }

    return "I can help with payment status, recent orders, WhatsApp support, and shopping guidance. Try one of the quick actions below.";
  };

  const sendMessage = () => {
    const userText = input.trim();
    if (!userText) {
      return;
    }

    pushMessage({ from: "user", text: userText });
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      pushMessage({ from: "bot", text: botReplyFor(userText) });
      setIsTyping(false);
    }, 650);
  };

  const handleQuickAction = async (action) => {
    if (action === "welcome") {
      pushMessage({
        from: "bot",
        text: "SmartShop concierge is tuned for premium discovery, checkout confidence, and fast support handoffs.",
      });
      return;
    }

    if (action === "payment") {
      pushMessage({ from: "bot", text: "Checking the latest payment status now." });
      try {
        const orderId = localStorage.getItem("lastOrderId") || 1;
        const res = await axios.get(buildApiUrl(`/api/payment_status/${orderId}`));
        const payment = res.data;
        pushMessage({
          from: "bot",
          text: `Order ${payment.order_id || orderId} payment status: ${payment.status || "unknown"}.`,
        });
      } catch {
        pushMessage({ from: "bot", text: "I could not fetch the payment status just now." });
      }
      return;
    }

    if (action === "orders") {
      pushMessage({ from: "bot", text: "Pulling the latest orders from SmartShop." });
      try {
        const res = await axios.get(buildApiUrl("/api/orders"));
        const orders = Array.isArray(res.data) ? res.data : [];

        if (orders.length === 0) {
          pushMessage({ from: "bot", text: "No recent orders were found." });
          return;
        }

        orders.slice(0, 3).forEach((order) => {
          pushMessage({
            from: "bot",
            text: `Order ${order.order_id}: KES ${order.amount} and currently ${order.status}.`,
          });
        });
      } catch {
        pushMessage({ from: "bot", text: "The order feed is unavailable right now." });
      }
      return;
    }

    if (action === "support") {
      window.open("https://wa.me/254105443420", "_blank");
      pushMessage({ from: "bot", text: "Opening WhatsApp support for a live conversation." });
    }
  };

  useEffect(() => {
    const handler = (e) => {
      const { type, detail } = e.detail;
      let label = "Update";
      if (type === "success") label = "Success";
      if (type === "error") label = "Error";
      if (type === "info") label = "Info";
      pushMessage({ from: "bot", text: `${label}: ${detail}` });
    };

    window.addEventListener("chatbot-notify", handler);
    return () => window.removeEventListener("chatbot-notify", handler);
  }, []);

  useEffect(() => {
    if (!bodyRef.current) {
      return;
    }

    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle" onClick={toggleChat}>
          <FaRobot size={22} /> Concierge
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <strong>SmartShop Concierge</strong>
              <span>Premium support, orders, and payments</span>
            </div>
            <FaTimes className="close-btn" onClick={toggleChat} />
          </div>

          <div className="chatbot-hero">
            <span className="chatbot-status">Live assistant</span>
            <h3>Need help closing the sale?</h3>
            <p>Use quick actions for the most common shopper and admin moments.</p>
          </div>

          <div className="quick-actions">
            <button onClick={() => handleQuickAction("welcome")}>
              <FaBolt /> Store intro
            </button>
            <button onClick={() => handleQuickAction("payment")}>
              <FaReceipt /> Payment status
            </button>
            <button onClick={() => handleQuickAction("orders")}>
              <FaRobot /> Latest orders
            </button>
            <button onClick={() => handleQuickAction("support")}>
              <FaHeadset /> WhatsApp support
            </button>
          </div>

          <div className="chatbot-body" ref={bodyRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.from === "user" ? "user" : "bot"}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div className="chat-message bot chatbot-typing">Marvoh is typing...</div>}
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Ask about orders, support, payments, or products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
