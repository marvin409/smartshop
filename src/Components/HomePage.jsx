import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaArrowRight,
  FaBolt,
  FaFireAlt,
  FaGem,
  FaHeadset,
  FaShieldAlt,
  FaSnowflake,
  FaStar,
  FaTruck,
  FaTv,
} from "react-icons/fa";
import HeroBanner from "./HeroBanner";
import ProductCard from "./ProductCard";
import { buildApiUrl } from "../utils/api";

const categoryCards = [
  { title: "Kitchen Power", subtitle: "Cookers, blenders, microwaves, and prep essentials", icon: "KP", slug: "home" },
  { title: "Cooling & Comfort", subtitle: "Fridges, fans, and comfort systems for modern homes", icon: "CC", slug: "electronics" },
  { title: "Laundry Upgrade", subtitle: "Washing solutions built for busy households", icon: "LU", slug: "home" },
  { title: "Entertainment Hub", subtitle: "Smart TVs, sound, and connected living-room setups", icon: "EH", slug: "electronics" },
];

const promoCards = [
  { eyebrow: "Signature Savings", title: "Premium appliance deals with designer-level presentation", copy: "Discover polished offers across kitchen, cooling, laundry, and home entertainment." },
  { eyebrow: "Concierge Delivery", title: "Fast order handoff with payment and support built in", copy: "From product discovery to M-Pesa checkout, SmartShop Appliances feels guided and frictionless." },
  { eyebrow: "Store Intelligence", title: "Modern storefront storytelling for every product category", copy: "Sharper copy, stronger visual hierarchy, and trust-building details help customers buy faster." },
];

const premiumStats = [
  { label: "Curated appliance drops", value: "120+", detail: "Fresh deals across cooking, cooling, and living." },
  { label: "Trusted checkout", value: "M-Pesa", detail: "Fast local payment flow ready at every step." },
  { label: "Concierge support", value: "24/7", detail: "Chatbot, WhatsApp, and guided service touchpoints." },
];

const premiumFeatures = [
  {
    icon: <FaGem />,
    title: "Premium discovery",
    copy: "Sharper category browsing, richer product highlights, and a storefront that feels high-end the moment it loads.",
  },
  {
    icon: <FaTruck />,
    title: "Delivery confidence",
    copy: "Guide shoppers from product discovery to payment with cleaner handoffs and clearer purchase momentum.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Admin control",
    copy: "Protected routes and a cleaner dashboard foundation keep operational actions separate from public browsing.",
  },
  {
    icon: <FaHeadset />,
    title: "Concierge support",
    copy: "A floating assistant can surface payment status, recent orders, and support shortcuts without leaving the page.",
  },
];

const showroomCollections = [
  {
    icon: <FaSnowflake />,
    eyebrow: "Cooling Collection",
    title: "Fridges and freezers selected for modern family routines.",
    copy: "Energy-smart storage, polished finishes, and dependable freshness for everyday convenience.",
  },
  {
    icon: <FaFireAlt />,
    eyebrow: "Kitchen Studio",
    title: "Cooking appliances that turn busy kitchens into premium spaces.",
    copy: "Upgrade prep, baking, blending, and weekday meals with tools that feel built for real homes.",
  },
  {
    icon: <FaTv />,
    eyebrow: "Living Room Tech",
    title: "Entertainment systems that look as good as they perform.",
    copy: "Bring cinematic sound, crystal-clear screens, and clean design into your daily downtime.",
  },
];

const showroomReviews = [
  {
    quote: "SmartShop Appliances feels like a premium showroom now. The products are easier to trust and easier to compare.",
    author: "Home setup customer",
  },
  {
    quote: "The checkout flow and support prompts make the store feel much more polished and intentional.",
    author: "Nairobi shopper",
  },
];

const describeProduct = (product) => {
  if (product?.description) {
    return product.description;
  }

  const category = String(product?.category || "appliance").toLowerCase();
  const descriptions = {
    electronics: "Smart performance, clean design, and everyday reliability for connected homes.",
    home: "Built to simplify daily routines with comfort-first features and polished styling.",
    beauty: "Curated essentials with elevated quality and shelf-worthy presentation.",
    fashion: "Refined picks with modern appeal and easy everyday confidence.",
    sports: "Performance-focused gear selected for active routines and lasting value.",
  };

  return descriptions[category] || "A well-picked SmartShop Appliances favorite designed for convenience and dependable value.";
};

const fallbackProducts = [
  { product_id: "demo-1", name: "Smart LED TV 43 inch", price: 34999, image_url: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80", category: "electronics" },
  { product_id: "demo-2", name: "Countertop Blender Pro", price: 8999, image_url: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=80", category: "home" },
  { product_id: "demo-3", name: "Wireless Noise-Canceling Headphones", price: 12499, image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", category: "electronics" },
  { product_id: "demo-4", name: "Running Shoes Everyday Fit", price: 6299, image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", category: "fashion" },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    axios
      .get(buildApiUrl("/api/products"))
      .then((res) => {
        if (!active) {
          return;
        }

        const items = Array.isArray(res.data) ? res.data : [];
        setProducts(items);
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

  const featuredProducts = useMemo(() => {
    const source = products.length > 0 ? products : fallbackProducts;
    return source.slice(0, 8);
  }, [products]);

  const spotlightProducts = useMemo(() => {
    return featuredProducts.slice(0, 3).map((product, index) => ({
      ...product,
      blurb: describeProduct(product),
      accent: ["Best value", "Designer pick", "Fast mover"][index] || "Featured",
    }));
  }, [featuredProducts]);

  return (
    <div className="storefront-page">
      <HeroBanner />
      <section className="hero-shell">
        <div className="hero-copy">
          <span className="eyebrow">SmartShop Appliances</span>
          <h1>Premium appliances, modern living essentials, and a storefront that feels world-class.</h1>
          <p>
            SmartShop Appliances now leads with cleaner discovery, elevated styling, stronger merchandising,
            and a luxury-inspired shopping journey built for confident online buying.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="cta-primary">Shop the showroom</Link>
            <Link to="/customer-service" className="cta-secondary">Talk to support</Link>
          </div>
          <div className="hero-trust-row">
            <div className="hero-trust-pill">
              <FaGem />
              <span>Curated premium catalog</span>
            </div>
            <div className="hero-trust-pill">
              <FaTruck />
              <span>Fast local fulfillment flow</span>
            </div>
            <div className="hero-trust-pill">
              <FaShieldAlt />
              <span>Trusted payment and admin control</span>
            </div>
          </div>
        </div>

        <div className="hero-grid">
          {promoCards.map((card) => (
            <article key={card.title} className="promo-card">
              <span>{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="showroom-spotlight-grid">
        {spotlightProducts.map((product, index) => (
          <article key={product.product_id || product.id || `${product.name}-${index}`} className="showroom-spotlight-card">
            <div className="showroom-spotlight-topline">
              <span>{product.accent}</span>
              <strong>{product.category || "Featured"}</strong>
            </div>
            <h3>{product.name}</h3>
            <p>{product.blurb}</p>
            <Link to="/products" className="showroom-spotlight-link">
              Explore this category <FaArrowRight />
            </Link>
          </article>
        ))}
      </section>

      <section className="category-strip">
        {categoryCards.map((category) => (
          <Link key={category.title} to={`/products?category=${category.slug}`} className="category-card">
            <strong>{category.icon}</strong>
            <div>
              <h3>{category.title}</h3>
              <p>{category.subtitle}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="luxury-stats">
        {premiumStats.map((stat) => (
          <article key={stat.label} className="luxury-stat-card">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <p>{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="showroom-collections">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Showroom edit</span>
            <h2>Thoughtful collections for every room in the home</h2>
            <p className="catalog-subtitle">
              Each SmartShop Appliances section now sells the lifestyle as much as the product.
            </p>
          </div>
        </div>

        <div className="showroom-collection-grid">
          {showroomCollections.map((collection) => (
            <article key={collection.title} className="showroom-collection-card">
              <div className="showroom-collection-icon">{collection.icon}</div>
              <span>{collection.eyebrow}</span>
              <h3>{collection.title}</h3>
              <p>{collection.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="product-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured today</span>
            <h2>Top picks from SmartShop Appliances</h2>
          </div>
          <Link to="/products" className="section-link">See all</Link>
        </div>

        {loading ? (
          <div className="empty-state">Loading products...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.product_id || product.id || `${product.name}-${index}`}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      <section className="premium-feature-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Premium experience</span>
            <h2>Storefront features that now feel premium on first glance</h2>
          </div>
          <Link to="/customer-service" className="section-link">
            Support center <FaArrowRight />
          </Link>
        </div>

        <div className="premium-feature-grid">
          {premiumFeatures.map((feature) => (
            <article key={feature.title} className="premium-feature-card">
              <div className="premium-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="showroom-review-strip">
        {showroomReviews.map((review) => (
          <article key={review.author} className="showroom-review-card">
            <div className="showroom-review-stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <p>{review.quote}</p>
            <strong>{review.author}</strong>
          </article>
        ))}
      </section>

      <section className="concierge-banner">
        <div>
          <span className="eyebrow">Concierge mode</span>
          <h2>Sell premium appliances with a smoother storefront and smarter support.</h2>
          <p>
            Your store now carries stronger luxury cues, clearer product storytelling, richer section content,
            and a more intentional SmartShop Appliances brand presence from hero to footer.
          </p>
        </div>
        <Link to="/products" className="cta-primary concierge-cta">
          Explore catalog <FaBolt />
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
