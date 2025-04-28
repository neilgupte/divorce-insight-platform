
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const NetworkOptimization = () => {
  const location = useLocation();
  
  // Redirect to dashboard if at the base /network route
  if (location.pathname === "/network") {
    return <Navigate to="/network/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default NetworkOptimization;
