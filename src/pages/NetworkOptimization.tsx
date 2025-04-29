
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NetworkDashboard from "@/components/network-optimization/NetworkDashboard";
import FacilityTableView from "@/components/network-optimization/FacilityTableView";
import ScenarioSimulation from "@/components/network-optimization/ScenarioSimulation";
import NetworkSettings from "@/components/network-optimization/NetworkSettings";
import NetworkAIAssistant from "@/components/network-optimization/NetworkAIAssistant";

const NetworkOptimization = () => {
  const location = useLocation();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  
  // If at the root network path, redirect to dashboard
  if (location.pathname === "/network") {
    return <Navigate to="/network/dashboard" replace />;
  }
  
  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route path="dashboard" element={<NetworkDashboard />} />
        <Route path="table" element={<FacilityTableView />} />
        <Route path="simulation" element={<ScenarioSimulation />} />
        <Route path="settings" element={<NetworkSettings />} />
        <Route path="*" element={<Navigate to="/network/dashboard" replace />} />
      </Routes>
      
      {/* AI Assistant Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)} 
          className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 transition-all"
          aria-label="AI Assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M10 11v-1a2 2 0 1 1 4 0v1"/><line x1="9" x2="9" y1="15" y2="15"/><line x1="15" x2="15" y1="15" y2="15"/></svg>
        </button>
      </div>
      
      {/* AI Assistant Dialog */}
      {isAIAssistantOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 h-96">
          <NetworkAIAssistant onClose={() => setIsAIAssistantOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default NetworkOptimization;
