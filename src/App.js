import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import AdminDashboard from "./Components/AdminDashboard";
import PlaceOrder from "./Components/PlaceOrder";
import MpesaPayment from "./Components/MpesaPayment";
import AddProduct from "./Components/AddProduct";
import Cart from "./Components/Cart";
import ProtectedRoute from "./Components/ProtectedRoute";
import { CartProvider } from "./Components/CartContext";
import { WishlistProvider } from "./Components/WishlistContext";
import ActivityLog from "./Components/ActivityLog";
import OrdersPage from "./Components/OrdersPage";
import DealsPage from "./Components/DealsPage";
import BestSellersPage from "./Components/BestSellersPage";
import CustomerServicePage from "./Components/CustomerServicePage";
import NewArrivalsPage from "./Components/NewArrivalsPage";
import GiftShopPage from "./Components/GiftShopPage";
import AboutPage from "./Components/AboutPage";
import TermsPage from "./Components/TermsPage";
import PrivacyPage from "./Components/PrivacyPage";
import MiniCart from "./Components/MiniCart";
import ToastConfig from "./Components/ToastConfig";
import Footer from "./Components/Footer";
import ProductsPage from "./Components/ProductsPage";
import OrderDetails from "./Components/OrderDetails";
import HomePage from "./Components/HomePage";
import Chatbot from "./Components/Chatbot";
import WishlistPage from "./Components/WishlistPage";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <div className="app-shell">
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/bestsellers" element={<BestSellersPage />} />
                <Route path="/customer-service" element={<CustomerServicePage />} />
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/gift-shop" element={<GiftShopPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/cart" element={<Cart />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-product"
                  element={
                    <ProtectedRoute>
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/place-order"
                  element={
                    <ProtectedRoute>
                      <PlaceOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mpesa"
                  element={
                    <ProtectedRoute>
                      <MpesaPayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/activity-log"
                  element={
                    <ProtectedRoute>
                      <ActivityLog />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <ToastConfig />
            <MiniCart />
            <Chatbot />
            <Footer />
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
