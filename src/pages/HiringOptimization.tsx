
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HiringDashboard from "@/components/hiring-optimization/HiringDashboard";
import FloatingAIChatbot from "@/components/common/FloatingAIChatbot";
import { HiringSidebar } from "@/components/hiring-optimization/HiringSidebar";

const HiringOptimization = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Toggle sidebar collapse state
  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // If at the root hiring path, redirect to dashboard
  if (location.pathname === "/hiring") {
    return <Navigate to="/hiring/dashboard" replace />;
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Hiring Sidebar */}
      <HiringSidebar 
        sidebarCollapsed={sidebarCollapsed} 
        toggleCollapse={toggleCollapse} 
      />
      
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="dashboard" element={<HiringDashboard />} />
          <Route path="location-analyzer" element={<div className="p-6"><h1 className="text-3xl font-bold">Location Analyzer</h1></div>} />
          <Route path="hiring-lever-tool" element={<div className="p-6"><h1 className="text-3xl font-bold">Hiring Lever Tool</h1></div>} />
          <Route path="scenario-builder" element={<div className="p-6"><h1 className="text-3xl font-bold">Scenario Builder</h1></div>} />
          <Route path="cost-analysis" element={<div className="p-6"><h1 className="text-3xl font-bold">Cost Analysis</h1></div>} />
          <Route path="impact-reports" element={<div className="p-6"><h1 className="text-3xl font-bold">Impact Reports</h1></div>} />
          <Route path="help-support" element={<div className="p-6"><h1 className="text-3xl font-bold">Help & Support</h1></div>} />
          <Route path="*" element={<Navigate to="/hiring/dashboard" replace />} />
        </Routes>
        
        {/* AI Assistant */}
        <FloatingAIChatbot 
          title="Hiring AI Assistant"
          initialMessage="Hello! I can help you optimize your hiring strategies. What would you like to know about hiring optimization?"
        />
      </div>
    </div>
  );
};

export default HiringOptimization;
