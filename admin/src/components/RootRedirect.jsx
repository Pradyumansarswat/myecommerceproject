import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const RootRedirect = () => {
  const token = Cookies.get("token");

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/admin/login" replace />;
};

export default RootRedirect;
