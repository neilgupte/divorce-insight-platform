
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const NetworkOptimization = () => {
  const location = useLocation();
  
  // Only have dashboard now, redirect everything else there
  if (location.pathname === "/network") {
    return <Navigate to="/network/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default NetworkOptimization;
