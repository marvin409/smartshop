import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaAward,
  FaBoxOpen,
  FaGlobe,
  FaHeart,
  FaHistory,
  FaMagic,
  FaMoneyBillWave,
  FaMoon,
  FaSearch,
  FaShieldAlt,
  FaShoppingCart,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";
import { CartContext } from "./CartContext";
import { WishlistContext } from "./WishlistContext";
import MegaMenu from "./MegaMenu";
import { buildApiUrl } from "../utils/api";
import { clearStoredUser, getStoredUser } from "../utils/auth";
import { enrichProduct, getCartItemTotal, searchCatalog } from "../utils/catalog";

const uiCopy = {
  en: {
    topline: "SmartShop Appliances brings premium showroom styling, faster search, and smarter admin control to Nairobi shoppers.",
    customerService: "Customer Service",
    deals: "Deals",
    arrivals: "New Arrivals",
    allDepartments: "All departments",
    products: "Products",
    wishlist: "Wishlist",
    cart: "Cart",
    mpesa: "M-Pesa",
    activity: "Activity",
    adminAccess: "Admin Access",
    brandLabel: "Appliances",
    brandNote: "Premium appliances for modern homes",
    searchPlaceholder: "Search by product name, category, description or catalog code",
    curatedBadge: "Curated catalog",
    deliveryBadge: "Fast support",
    trustBadge: "Protected admin",
  },
  sw: {
    topline: "SmartShop Appliances inaleta muonekano wa duka la kisasa, utafutaji wa haraka, na usimamizi bora wa admin kwa wanunuzi wa Nairobi.",
    customerService: "Huduma kwa Wateja",
    deals: "Ofa",
    arrivals: "Bidhaa Mpya",
    allDepartments: "Idara zote",
    products: "Bidhaa",
    wishlist: "Vipendwa",
    cart: "Kikapu",
    mpesa: "M-Pesa",
    activity: "Shughuli",
    adminAccess: "Admin Login",
    brandLabel: "Appliances",
    brandNote: "Premium appliances kwa nyumba za kisasa",
    searchPlaceholder: "Tafuta kwa jina, kundi, maelezo au catalog code",
    curatedBadge: "Catalog iliyochaguliwa",
    deliveryBadge: "Msaada wa haraka",
    trustBadge: "Admin salama",
  },
};

const Navbar = () => {
  const { cart, setCart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [suggestions, setSuggestions] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [user, setUser] = useState(getStoredUser());
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  const copy = uiCopy[language] || uiCopy.en;
  const totalAmount = cart.reduce((sum, item) => sum + getCartItemTotal(item), 0);
  const navHighlights = [
    { icon: <FaAward />, label: copy.curatedBadge },
    { icon: <FaMagic />, label: copy.deliveryBadge },
    { icon: <FaShieldAlt />, label: copy.trustBadge },
  ];

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    let active = true;

    axios
      .get(buildApiUrl("/api/products"))
      .then((res) => {
        if (!active) {
          return;
        }

        const items = Array.isArray(res.data) ? res.data.map(enrichProduct) : [];
        setCatalog(items);
      })
      .catch(() => {
        if (active) {
          setCatalog([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length <= 1) {
      setSuggestions([]);
      return;
    }

    setSuggestions(searchCatalog(catalog, searchTerm, category).slice(0, 5));
  }, [catalog, category, searchTerm]);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    window.addEventListener("storage", syncUser);
    window.addEventListener("smartshop-auth-changed", syncUser);
    syncUser();

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("smartshop-auth-changed", syncUser);
    };
  }, []);

  const clearCart = () => {
    setCart([]);
    toast.warn("Cart cleared");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      toast.error("Enter a search term");
      return;
    }

    const results = searchCatalog(catalog, searchTerm, category);
    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}&category=${encodeURIComponent(category)}`);

    if (results.length > 0) {
      toast.success(`Found ${results.length} product(s) in ${category}`);
    } else {
      toast.info("No products found");
    }
  };

  const handleSelectSuggestion = (name) => {
    setSearchTerm(name);
    setSuggestions([]);
    navigate(`/products?search=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`);
  };

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    toast.info("Signed out");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar premium-navbar">
        <div className="navbar-top premium-navbar-top">
          <p>{copy.topline}</p>
          <div className="navbar-top-links premium-navbar-top-links">
            <Link to="/customer-service">{copy.customerService}</Link>
            <Link to="/deals">{copy.deals}</Link>
            <Link to="/new-arrivals">{copy.arrivals}</Link>
            <button type="button" className="nav-utility-btn" onClick={() => setLanguage((current) => (current === "en" ? "sw" : "en"))}>
              <FaGlobe /> {language === "en" ? "EN" : "SW"}
            </button>
            <button type="button" className="nav-utility-btn" onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
              {theme === "light" ? <FaMoon /> : <FaSun />} {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        <div className="navbar-main premium-navbar-main">
          <div className="navbar-left premium-navbar-brand-wrap">
            <Link to="/" className="nav-logo nav-logo-brand premium-nav-logo" aria-label="SmartShop Appliances home">
              <img src="/brand/appliances-mark.png" alt="SmartShop Appliances" className="nav-brand-mark" />
              <div className="nav-brand-copy">
                <strong>SmartShop</strong>
                <span>{copy.brandLabel}</span>
                <small>{copy.brandNote}</small>
              </div>
            </Link>
          </div>

          <div className="navbar-center premium-navbar-center">
            <form onSubmit={handleSearch} className="nav-search premium-nav-search">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="nav-category"
              >
                <option value="all">{copy.allDepartments}</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Living</option>
                <option value="beauty">Beauty</option>
                <option value="sports">Sports</option>
              </select>
              <input
                type="text"
                placeholder={copy.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" aria-label="Search">
                <FaSearch />
              </button>

              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((item, index) => (
                    <li
                      key={item.id || item.product_id || `${item.name}-${index}`}
                      onClick={() => handleSelectSuggestion(item.name)}
                    >
                      {item.name} <span className="suggestion-category">{item.catalog_code || item.category || "catalog"}</span>
                    </li>
                  ))}
                </ul>
              )}
            </form>

            <div className="nav-search-meta premium-nav-search-meta">
              {navHighlights.map((item) => (
                <span key={item.label} className="nav-search-chip premium-nav-search-chip">
                  {item.icon} {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="navbar-right premium-navbar-right">
            <div className="nav-primary-links">
              <Link to="/products" className="nav-link premium-nav-link"><FaBoxOpen /> {copy.products}</Link>
              <Link to="/wishlist" className="nav-link premium-nav-link"><FaHeart /> {copy.wishlist} ({wishlist.length})</Link>
            </div>

            <div className="nav-action-links">
              <div className="nav-cart premium-nav-cart">
                <Link to="/cart" className="nav-link premium-nav-link nav-cart-link">
                  <FaShoppingCart /> {copy.cart} ({cart.length})
                </Link>
                <span className="cart-total-pill premium-cart-total">KES {totalAmount.toFixed(2)}</span>
              </div>

              <Link to="/mpesa" className="nav-link premium-nav-link"><FaMoneyBillWave /> {copy.mpesa}</Link>
              <Link to="/activity-log" className="nav-link premium-nav-link"><FaHistory /> {copy.activity}</Link>
              <Link to="/login" className="nav-link premium-nav-link nav-dashboard-link">
                <FaShieldAlt /> Dashboard
              </Link>
            </div>

            <div className="nav-account-tools">
              <div className="nav-user premium-nav-user">
                <FaUserCircle size={22} />
                <div className="user-dropdown">
                  {user ? (
                    <>
                      <span className="welcome">Signed in as {user.name || user.email}</span>
                      <Link to="/dashboard">Dashboard</Link>
                      <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">Admin Login</Link>
                      <span className="welcome">Store browsing stays public</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <MegaMenu />
      </nav>

      <div className="secondary-navbar premium-secondary-navbar">
        <Link to="/deals">Deals</Link>
        <Link to="/bestsellers">Best Sellers</Link>
        <Link to="/customer-service">Customer Service</Link>
        <Link to="/new-arrivals">New Arrivals</Link>
        <Link to="/gift-shop">Gift Shop</Link>
        <button type="button" className="nav-clear-btn" onClick={clearCart}>Clear cart</button>
      </div>

      <div className="deals-carousel">
        <div className="carousel-track">
          <div className="carousel-item">Up to 50% off electronics</div>
          <div className="carousel-item">Flash fashion markdowns this week</div>
          <div className="carousel-item">Home essentials under budget</div>
          <div className="carousel-item">Beauty bundles and daily picks</div>
          <div className="carousel-item">Sports gear offers across top brands</div>
          <div className="carousel-item">Up to 50% off electronics</div>
          <div className="carousel-item">Flash fashion markdowns this week</div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
