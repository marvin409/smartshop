import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { buildApiUrl } from "../utils/api";
import { storeUser } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const localFallbackEnabled = window.location.hostname === "localhost";

  const completeLogin = (user) => {
    storeUser(user);
    toast.success("Login successful. Redirecting to dashboard...");
    navigate("/dashboard");
  };

  const normalizeUser = (data) => {
    if (data?.user && typeof data.user === "object") {
      return data.user;
    }

    if (data?.admin && typeof data.admin === "object") {
      return data.admin;
    }

    if (data?.success) {
      return {
        name: data.name || "Admin",
        email,
        role: "admin",
      };
    }

    return null;
  };

  const tryLocalFallback = () => {
    const fallbackEmail = process.env.REACT_APP_ADMIN_EMAIL || "admin@smartshop.local";
    const fallbackPassword = process.env.REACT_APP_ADMIN_PASSWORD || "admin123";

    if (localFallbackEnabled && email === fallbackEmail && password === fallbackPassword) {
      completeLogin({
        name: "SmartShop appliances Admin",
        email,
        role: "admin",
        source: "local-fallback",
      });
      toast.info("Using local fallback login because the hosted admin API is unavailable.");
      return true;
    }

    return false;
  };

  const handleLogin = async () => {
    setIsSubmitting(true);

    try {
      const res = await axios.post(buildApiUrl("/api/admin_login"), { email, password });
      const user = normalizeUser(res.data);

      if (user) {
        if (res.data?.notification_summary) {
          toast.info(`Messaging: ${res.data.notification_summary}`, {
            autoClose: 5000,
          });
        }
        completeLogin(user);
        return;
      }

      if (!tryLocalFallback()) {
        toast.error(res.data?.error || "Login failed. Check your credentials and backend route.");
      }
    } catch (err) {
      if (!tryLocalFallback()) {
        toast.error(
          err.response?.data?.error ||
            "Unable to reach /api/admin_login. The backend in this workspace does not expose that route."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel auth-panel-copy">
        <span className="eyebrow">Admin access</span>
        <h1>Sign in to manage SmartShop appliances.</h1>
        <p>
          Admin login is connected to your hosted backend route at <code>/api/admin_login</code>.
          Use the admin account in your database to open the dashboard and manage the store.
        </p>
        <div className="auth-tips">
          <div>
            <strong>Hosted API</strong>
            <span>The React app now defaults to your AlwaysData backend unless you override it with an env var.</span>
          </div>
          <div>
            <strong>Admin access</strong>
            <span>
              Make sure your admin user has <code>is_admin = 1</code> so this login route accepts it.
            </span>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <h2>Admin Login</h2>
        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
