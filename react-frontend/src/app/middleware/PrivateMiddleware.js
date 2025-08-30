import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateMiddleware = ({ children, isAdmin = false }) => {
  const { token, isSuperAdmin } = useSelector((state) => state.auth);

  const location = useLocation();

  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin && !isSuperAdmin) {
    // Redirect to user dashboard if trying to access admin-only routes
    return <Navigate to="/dashboard" replace />;
  }
  // Redirect super admins away from user-only routes
  if (!isAdmin && isSuperAdmin) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PrivateMiddleware;
