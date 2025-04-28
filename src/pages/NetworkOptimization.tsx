
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NetworkDashboard from "@/components/network-optimization/NetworkDashboard";
import FacilityTableView from "@/components/network-optimization/FacilityTableView";

const NetworkOptimization = () => {
  const location = useLocation();
  
  // If at the root network path, redirect to dashboard
  if (location.pathname === "/network") {
    return <Navigate to="/network/dashboard" replace />;
  }
  
  return (
    <Routes>
      <Route path="dashboard" element={<NetworkDashboard />} />
      <Route path="table" element={<FacilityTableView />} />
      <Route path="*" element={<Navigate to="/network/dashboard" replace />} />
    </Routes>
  );
};

export default NetworkOptimization;
