
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import NetworkOptimization from "@/pages/NetworkOptimization";
import Dashboard from "@/pages/Dashboard";
import LocationAnalyzer from "@/pages/LocationAnalyzer";
import AuditLogs from "@/pages/AuditLogs";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";
import NetworkDashboard from "@/components/network-optimization/NetworkDashboard";
import NetworkFacilities from "@/pages/network/NetworkFacilities";
import NetworkWorkforce from "@/pages/network/NetworkWorkforce";
import NetworkCoverage from "@/pages/network/NetworkCoverage";
import NetworkScenarios from "@/pages/network/NetworkScenarios";
import NetworkHiring from "@/pages/network/NetworkHiring";
import NetworkRecommendations from "@/pages/network/NetworkRecommendations";
import NetworkLogs from "@/pages/network/NetworkLogs";
import NetworkHelp from "@/pages/network/NetworkHelp";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Real Estate IQ Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="location" element={<LocationAnalyzer />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Network Optimization Routes */}
        <Route path="/network" element={<NetworkOptimization />}>
          <Route path="dashboard" element={<NetworkDashboard />} />
          <Route path="facilities" element={<NetworkFacilities />} />
          <Route path="workforce" element={<NetworkWorkforce />} />
          <Route path="coverage" element={<NetworkCoverage />} />
          <Route path="scenarios" element={<NetworkScenarios />} />
          <Route path="hiring" element={<NetworkHiring />} />
          <Route path="recommendations" element={<NetworkRecommendations />} />
          <Route path="logs" element={<NetworkLogs />} />
          <Route path="help" element={<NetworkHelp />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
