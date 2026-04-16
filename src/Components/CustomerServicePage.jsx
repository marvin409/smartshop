import React, { useState } from "react";
import {
  FaArrowRight,
  FaClock,
  FaEnvelope,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaQuestionCircle,
  FaShieldAlt,
  FaWhatsapp,
} from "react-icons/fa";

const contactCards = [
  {
    icon: <FaWhatsapp />,
    title: "WhatsApp support",
    copy: "Start a quick chat for order updates, delivery questions, and product help.",
    actionLabel: "Chat now",
    href: "https://wa.me/254105443420",
  },
  {
    icon: <FaPhoneAlt />,
    title: "Call the store",
    copy: "Speak directly with Marvin Ochieng for urgent customer service needs.",
    actionLabel: "Call +254 105 443 420",
    href: "tel:+254105443420",
  },
  {
    icon: <FaInstagram />,
    title: "Instagram DM",
    copy: "Prefer social support? Reach out on Instagram and we will guide you there.",
    actionLabel: "@nai.raw.b3rry",
    href: "https://instagram.com/nai.raw.b3rry",
  },
];

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Browse products, add what you want to your cart, then continue to checkout and payment.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We currently support M-Pesa payments, with more payment options planned as the store grows.",
  },
  {
    question: "How long does delivery take?",
    answer: "Most orders arrive within 2 to 5 business days depending on your location and delivery volume.",
  },
  {
    question: "Can I return an item?",
    answer: "Yes. Unused items in original packaging can be returned within 7 days after delivery.",
  },
];

const supportRules = [
  "Payment must be completed before order processing begins.",
  "Delivery timelines are estimates and may vary by location.",
  "Returns are accepted within 7 days for unused items in original packaging.",
  "Customer information is kept private and used only for store operations.",
];

const CustomerServicePage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [confirmation, setConfirmation] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmation(`Thanks ${formData.name}. Your message has been received and our team will get back to you soon.`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="customer-service-page">
      <div className="customer-service-hero">
        <div className="customer-service-copy">
          <span className="eyebrow">Support hub</span>
          <h1>Customer care that feels as polished as the storefront.</h1>
          <p>
            Get answers fast, speak with the store directly, or leave a message for follow-up.
            This page brings customer support, store policies, and pickup information into one clean space.
          </p>

          <div className="support-quick-stats">
            <div className="support-stat-card">
              <span>Response line</span>
              <strong>WhatsApp first</strong>
            </div>
            <div className="support-stat-card">
              <span>Store hours</span>
              <strong>Mon to Sat</strong>
            </div>
            <div className="support-stat-card">
              <span>Pickup area</span>
              <strong>Nairobi CBD</strong>
            </div>
          </div>
        </div>

        <aside className="support-owner-card">
          <div className="support-owner-badge">Owner contact</div>
          <h2>Marvin Ochieng</h2>
          <p>
            Reach the store owner directly for escalations, urgent delivery questions, or order clarification.
          </p>

          <div className="support-owner-list">
            <a href="tel:+254105443420"><FaPhoneAlt /> +254 105 443 420</a>
            <a href="mailto:ochiengmarvin4004@gmail.com"><FaEnvelope /> ochiengmarvin4004@gmail.com</a>
            <a href="https://instagram.com/nai.raw.b3rry" target="_blank" rel="noopener noreferrer">
              <FaInstagram /> @nai.raw.b3rry
            </a>
          </div>
        </aside>
      </div>

      <section className="support-card-grid">
        {contactCards.map((card) => (
          <article key={card.title} className="support-channel-card">
            <div className="support-channel-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
            <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
              {card.actionLabel} <FaArrowRight />
            </a>
          </article>
        ))}
      </section>

      <section className="support-layout-grid">
        <article className="support-panel support-hours-panel">
          <div className="support-panel-heading">
            <FaClock />
            <h2>Support hours</h2>
          </div>
          <div className="support-hours-list">
            <div><span>Monday to Friday</span><strong>9:00 AM to 6:00 PM</strong></div>
            <div><span>Saturday</span><strong>10:00 AM to 4:00 PM</strong></div>
            <div><span>Sunday</span><strong>Closed</strong></div>
          </div>
        </article>

        <article className="support-panel support-form-panel">
          <div className="support-panel-heading">
            <FaEnvelope />
            <h2>Leave us a message</h2>
          </div>
          <p className="support-panel-copy">
            Share your order issue, product question, or feedback and we will follow up as soon as possible.
          </p>
          {confirmation && <div className="support-confirmation">{confirmation}</div>}
          <form onSubmit={handleSubmit} className="support-form">
            <div className="field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <span>Message</span>
              <textarea
                name="message"
                placeholder="Tell us how we can help"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="glow-button">Send message</button>
          </form>
        </article>
      </section>

      <section className="support-layout-grid support-layout-grid-bottom">
        <article className="support-panel">
          <div className="support-panel-heading">
            <FaQuestionCircle />
            <h2>Frequently asked questions</h2>
          </div>
          <div className="support-faq-list">
            {faqs.map((item) => (
              <div key={item.question} className="support-faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="support-panel support-policy-panel">
          <div className="support-panel-heading">
            <FaShieldAlt />
            <h2>Key store terms</h2>
          </div>
          <ul className="support-policy-list">
            {supportRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="support-location-grid">
        <article className="support-panel support-map-panel">
          <div className="support-panel-heading">
            <FaMapMarkerAlt />
            <h2>Pickup location</h2>
          </div>
          <p className="support-panel-copy">
            Collect eligible orders from Nairobi CBD after confirmation from the support team.
          </p>
          <div className="support-map-frame">
            <iframe
              title="SmartShop appliances location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.134390669163!2d36.81262010273161!3d-1.2832536120981738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d7b08cb66d%3A0xdbb8e25b6d9703df!2sNairobi%20CBD!5e0!3m2!1sen!2ske!4v1710000000000"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </article>

        <article className="support-panel support-chat-panel">
          <span className="eyebrow">Fastest path</span>
          <h2>Need instant help?</h2>
          <p>
            Use WhatsApp for the quickest response on order status, payment confirmation, and delivery coordination.
          </p>
          <a
            href="https://wa.me/254105443420"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
          >
            Open WhatsApp
          </a>
        </article>
      </section>
    </section>
  );
};

export default CustomerServicePage;
