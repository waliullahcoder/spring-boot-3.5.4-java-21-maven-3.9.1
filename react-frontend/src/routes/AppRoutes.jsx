import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminProtectedRoutes from "./AdminProtectedRoutes";
import UserProtectedRoutes from "./UserProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import { usePermissionBoolean } from "../utils/common";

const AppRoutes = () => {
  const { permissions, loading } = usePermissionBoolean(); // ✅ Call the hook inside the component

  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminProtectedRoutes permissions={permissions} />} />

      {/* User Routes */}
      {UserProtectedRoutes}

      {/* Public Routes */}
      {PublicRoutes}

      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
