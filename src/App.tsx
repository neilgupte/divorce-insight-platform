import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import LabourPlanningLayout from "@/components/layout/LabourPlanningLayout";
import NetworkOptimization from "@/pages/NetworkOptimization";
import LabourPotentialLayout from "@/components/layout/LabourPotentialLayout";
import Dashboard from "@/pages/Dashboard";
import LocationAnalyzer from "@/pages/LocationAnalyzer";
import Reports from "@/pages/Reports";
import Documents from "@/pages/Documents";
import Assistant from "@/pages/Assistant";
import AuditLogs from "@/pages/AuditLogs";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NetworkDashboard from "@/components/network-optimization/NetworkDashboard";
import NetworkFacilities from "@/pages/network/NetworkFacilities";
import NetworkWorkforce from "@/pages/network/NetworkWorkforce";
import NetworkCoverage from "@/pages/network/NetworkCoverage";
import NetworkScenarios from "@/pages/network/NetworkScenarios";
import NetworkHiring from "@/pages/network/NetworkHiring";
import NetworkRecommendations from "@/pages/network/NetworkRecommendations";
import NetworkLogs from "@/pages/network/NetworkLogs";
import NetworkHelp from "@/pages/network/NetworkHelp";

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
          <Route path="reports" element={<Reports />} />
          <Route path="documents" element={<Documents />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
        </Route>

        {/* Labour Planning Routes */}
        <Route path="/labour-planning" element={<LabourPlanningLayout />}>
          {/* Add Labour Planning routes here */}
        </Route>

        {/* Labour Potential Routes */}
        <Route path="/labour-potential" element={<LabourPotentialLayout />}>
          {/* Add Labour Potential routes here */}
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
