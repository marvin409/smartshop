import React from "react";
import { Navigate } from "react-router-dom";
import { getStoredUser, isAdminUser } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const user = getStoredUser();
  return isAdminUser(user) ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
