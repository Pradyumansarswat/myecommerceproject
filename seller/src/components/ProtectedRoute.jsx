import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/seller/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
