import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaGem, FaHeadset, FaShieldAlt } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const banners = [
  {
    eyebrow: "Premium Kitchen Event",
    title: "Designer-worthy appliances for kitchens that deserve a polished upgrade.",
    copy: "From blenders and cookers to statement-making essentials, SmartShop Appliances now feels like a curated showroom.",
    accent: "Curated for cooking, hosting, and modern daily living",
    link: "/products?category=home",
    icon: <FaGem />,
  },
  {
    eyebrow: "Entertainment Upgrade",
    title: "Smart screens and home tech that turn everyday spaces into standout rooms.",
    copy: "Explore living-room electronics with premium styling, stronger merchandising, and smoother product discovery.",
    accent: "Built for comfort, clarity, and connected homes",
    link: "/products?category=electronics",
    icon: <FaShieldAlt />,
  },
  {
    eyebrow: "Concierge Support",
    title: "Shop with cleaner checkout, guided help, and support that stays within reach.",
    copy: "SmartShop Appliances now combines premium presentation with practical support across search, payment, and delivery.",
    accent: "Support-first service with WhatsApp and in-store guidance",
    link: "/customer-service",
    icon: <FaHeadset />,
  },
];

const HeroBanner = () => {
  const settings = {
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <motion.section
      className="hero-banner"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.title} className="banner-slide">
            <div className="hero-banner-panel">
              <div className="hero-banner-copy">
                <span className="hero-banner-eyebrow">{banner.eyebrow}</span>
                <h2>{banner.title}</h2>
                <p>{banner.copy}</p>
                <div className="hero-banner-meta">
                  <span>
                    {banner.icon}
                    {banner.accent}
                  </span>
                </div>
              </div>
              <div className="hero-banner-actions">
                <Link to={banner.link} className="hero-banner-link">
                  Explore now <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </motion.section>
  );
};

export default HeroBanner;
