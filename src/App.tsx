import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Location from "@/pages/Location";
import Reports from "@/pages/Reports";
import Documents from "@/pages/Documents";
import Assistant from "@/pages/Assistant";
import AuditLogs from "@/pages/AuditLogs";
import Users from "@/pages/Users";
import SettingsPage from "@/pages/Settings";
import LabourPlanning from "@/pages/LabourPlanning";
import LabourPlanningCreate from "@/pages/LabourPlanningCreate";
import TaskMapping from "@/pages/TaskMapping";
import ModelRuns from "@/pages/ModelRuns";
import LabourPlanningLocations from "@/pages/LabourPlanningLocations";
import LabourPlanningSettings from "@/pages/LabourPlanningSettings";
import LabourPotentialDashboard from "@/pages/LabourPotentialDashboard";
import LabourPotentialSearch from "@/pages/LabourPotentialSearch";
import LabourPotentialSupplyDemand from "@/pages/LabourPotentialSupplyDemand";
import LabourPotentialReports from "@/pages/LabourPotentialReports";
import LabourPotentialSettings from "@/pages/LabourPotentialSettings";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

// Import our new Dashboard2 component
import Dashboard2 from "./pages/Dashboard2";

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard2" element={<Dashboard2 />} />
            <Route path="location" element={<Location />} />
            <Route path="reports" element={<Reports />} />
            <Route path="documents" element={<Documents />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="labour-planning" element={<LabourPlanning />} />
            <Route path="labour-planning/create" element={<LabourPlanningCreate />} />
            <Route path="labour-planning/task-mapping" element={<TaskMapping />} />
            <Route path="labour-planning/model-runs" element={<ModelRuns />} />
            <Route path="labour-planning/locations" element={<LabourPlanningLocations />} />
            <Route path="labour-planning/settings" element={<LabourPlanningSettings />} />
            <Route path="labour-potential/dashboard" element={<LabourPotentialDashboard />} />
            <Route path="labour-potential/search" element={<LabourPotentialSearch />} />
            <Route path="labour-potential/supply-vs-demand" element={<LabourPotentialSupplyDemand />} />
            <Route path="labour-potential/reports" element={<LabourPotentialReports />} />
            <Route path="labour-potential/settings" element={<LabourPotentialSettings />} />
            <Route path="help" element={<Help />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </Router>
  );
};

export default App;
