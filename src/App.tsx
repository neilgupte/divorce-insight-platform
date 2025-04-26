import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/components/layout/MainLayout";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { MessagingProvider } from "@/contexts/MessagingContext";

// Pages
import Login from "@/pages/Login";
import Dashboard2 from "@/pages/Dashboard2";
import LabourPlanningDashboard from "@/pages/LabourPlanningDashboard";
import CreateLabourModel from "@/pages/labour-planning/CreateLabourModel";
import TaskMapping from "@/pages/labour-planning/TaskMapping";
import ModelRuns from "@/pages/labour-planning/ModelRuns";
import ModelResults from "@/pages/labour-planning/ModelResults";
import LabourPlanningLocations from "@/pages/LabourPlanningLocations";
import LabourPotential from "@/pages/LabourPotential";
import NetworkOptimization from "@/pages/NetworkOptimization";
import NotFound from "@/pages/NotFound";

// Labour Potential Components
import { LabourPotentialWrapper } from "@/components/labour-potential/LabourPotentialWrapper";
import { LabourDashboard } from "@/components/labour-potential/LabourDashboard";
import { SearchLocation } from "@/components/labour-potential/SearchLocation";
import { SupplyDemandView } from "@/components/labour-potential/SupplyDemandView";
import { MarketReportGenerator } from "@/components/labour-potential/MarketReportGenerator";
import { LabourSettings } from "@/components/labour-potential/LabourSettings";

// Network Optimization Components
import { NetworkDashboard } from "@/components/network-optimization/NetworkDashboard";
import { NetworkMap } from "@/components/network-optimization/NetworkMap";
import { ScenarioSimulation } from "@/components/network-optimization/ScenarioSimulation";
import FacilityMap from "@/components/network-optimization/FacilityMap"; // ✅ FIXED: NO CURLY BRACES
import  FacilityTable  from "@/components/network-optimization/FacilityTable";
import { NetworkSettings } from "@/components/network-optimization/NetworkSettings";

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <MessagingProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/dashboard2" />} />
                  <Route path="dashboard2" element={<Dashboard2 />} />

                  {/* Labour Planning Routes */}
                  <Route path="labour-planning" element={<LabourPlanningDashboard />} />
                  <Route path="labour-planning/create" element={<CreateLabourModel />} />
                  <Route path="labour-planning/create/:modelId" element={<CreateLabourModel />} />
                  <Route path="labour-planning/task-mapping" element={<TaskMapping />} />
                  <Route path="labour-planning/model-runs" element={<ModelRuns />} />
                  <Route path="labour-planning/model-runs/:runId" element={<ModelResults />} />
                  <Route path="labour-planning/locations" element={<LabourPlanningLocations />} />

                  {/* Labour Potential Routes */}
                  <Route path="labour-potential" element={<LabourPotential />}>
                    <Route index element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<LabourPotentialWrapper component={LabourDashboard} />} />
                    <Route path="search" element={<LabourPotentialWrapper component={SearchLocation} />} />
                    <Route path="supply-vs-demand" element={<LabourPotentialWrapper component={SupplyDemandView} />} />
                    <Route path="reports" element={<LabourPotentialWrapper component={MarketReportGenerator} />} />
                    <Route path="settings" element={<LabourPotentialWrapper component={LabourSettings} />} />
                  </Route>

                  {/* Network Optimization Routes */}
                  <Route path="network-optimization" element={<NetworkOptimization />}>
                    <Route index element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<NetworkDashboard />} />
                    <Route path="map" element={<NetworkMap />} />
                    <Route path="simulation" element={<ScenarioSimulation />} />
                    <Route path="facilities/map" element={<FacilityMap />} /> {/* ✅ Fixed */}
                    <Route path="facilities/table" element={<FacilityTable />} />
                    <Route path="settings" element={<NetworkSettings />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <Toaster />
            </MessagingProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
