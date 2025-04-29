
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HiringDashboard from "@/components/hiring-optimization/HiringDashboard";
import FloatingAIChatbot from "@/components/common/FloatingAIChatbot";
import { SidebarProvider } from "@/components/ui/sidebar";
import HiringSidebar from "@/components/hiring-optimization/HiringSidebar";

const HiringOptimization = () => {
  const location = useLocation();
  
  // If at the root hiring path, redirect to dashboard
  if (location.pathname === "/hiring") {
    return <Navigate to="/hiring/dashboard" replace />;
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <HiringSidebar />
        <div className="flex-1 relative">
          <Routes>
            <Route path="dashboard" element={<HiringDashboard />} />
            <Route path="location-analyzer" element={<div className="p-6"><h1 className="text-3xl font-bold">Location Analyzer</h1><p className="mt-2 text-muted-foreground">Analyze hiring locations and opportunities</p></div>} />
            <Route path="hiring-lever-tool" element={<div className="p-6"><h1 className="text-3xl font-bold">Hiring Lever Tool</h1><p className="mt-2 text-muted-foreground">Identify effective hiring strategies</p></div>} />
            <Route path="scenario-builder" element={<div className="p-6"><h1 className="text-3xl font-bold">Scenario Builder</h1><p className="mt-2 text-muted-foreground">Build and compare hiring scenarios</p></div>} />
            <Route path="cost-analysis" element={<div className="p-6"><h1 className="text-3xl font-bold">Cost Analysis</h1><p className="mt-2 text-muted-foreground">Analyze costs associated with different hiring strategies</p></div>} />
            <Route path="impact-reports" element={<div className="p-6"><h1 className="text-3xl font-bold">Impact Reports</h1><p className="mt-2 text-muted-foreground">Generate reports on hiring strategy impacts</p></div>} />
            <Route path="*" element={<Navigate to="/hiring/dashboard" replace />} />
          </Routes>
          
          {/* AI Assistant */}
          <FloatingAIChatbot 
            title="Hiring AI Assistant"
            initialMessage="Hello! I can help you optimize your hiring strategies. What would you like to know about hiring optimization?"
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HiringOptimization;
