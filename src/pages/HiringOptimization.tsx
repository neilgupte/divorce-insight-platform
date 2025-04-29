
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HiringDashboard from "@/components/hiring-optimization/HiringDashboard";
import FloatingAIChatbot from "@/components/common/FloatingAIChatbot";

const HiringOptimization = () => {
  const location = useLocation();
  
  // If at the root hiring path, redirect to dashboard
  if (location.pathname === "/hiring") {
    return <Navigate to="/hiring/dashboard" replace />;
  }
  
  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route path="dashboard" element={<HiringDashboard />} />
        <Route path="*" element={<Navigate to="/hiring/dashboard" replace />} />
      </Routes>
      
      {/* AI Assistant */}
      <FloatingAIChatbot 
        title="Hiring AI Assistant"
        initialMessage="Hello! I can help you optimize your hiring strategies. What would you like to know about hiring optimization?"
      />
    </div>
  );
};

export default HiringOptimization;
