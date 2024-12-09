import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const RootRedirect = () => {
  const token = Cookies.get("token");

  if (token) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  return <Navigate to="/seller/login" replace />;
};

export default RootRedirect;
