
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryProvider } from './components/QueryProvider';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Dashboard2 from '@/pages/Dashboard2';
import LocationAnalyzer from '@/pages/LocationAnalyzer';
import LabourPotential from '@/pages/LabourPotential';
import NetworkOptimization from '@/pages/NetworkOptimization';
import LabourPlanningDashboard from '@/pages/LabourPlanningDashboard';
import UserManagement from '@/pages/UserManagement';
import ReportGenerator from '@/pages/ReportGenerator';
import DocumentVault from '@/pages/DocumentVault';
import HelpSupport from '@/pages/HelpSupport';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard2" element={<Dashboard2 />} />
            <Route path="location" element={<LocationAnalyzer />} />
            <Route path="labor-potential" element={<LabourPotential />} />
            <Route path="network-optimization" element={<NetworkOptimization />} />
            <Route path="labour-planning" element={<LabourPlanningDashboard />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="report-generator" element={<ReportGenerator />} />
            <Route path="document-vault" element={<DocumentVault />} />
            <Route path="help-support" element={<HelpSupport />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </QueryProvider>
  );
}

export default App;
