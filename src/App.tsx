import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { MessagingProvider } from "@/contexts/MessagingContext";
import MainLayout from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LocationAnalyzer from "@/pages/LocationAnalyzer";
import ReportGenerator from "@/pages/ReportGenerator";
import DocumentVault from "@/pages/DocumentVault";
import AIAssistant from "@/pages/AIAssistant";
import UserManagement from "@/pages/UserManagement";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import LuxuryLocations from "@/pages/LuxuryLocations";
import Index from "@/pages/Index";
import AuditLogs from "@/pages/AuditLogs";
import HelpSupport from "@/pages/HelpSupport";
import LabourPlanning from "@/pages/LabourPlanning";
import Reports from "@/pages/Reports";
import Locations from "@/pages/Locations";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requiredPermission }: { children: React.ReactNode, requiredPermission?: string }) => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <NotificationProvider>
          <MessagingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Index />} />
                  
                  <Route path="/" element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }>
                    {/* Real Estate IQ Routes */}
                    <Route path="dashboard" element={
                      <ProtectedRoute requiredPermission="dashboard:view">
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="location" element={
                      <ProtectedRoute requiredPermission="location:view">
                        <LocationAnalyzer />
                      </ProtectedRoute>
                    } />
                    <Route path="luxury-locations" element={
                      <ProtectedRoute requiredPermission="location:view">
                        <LuxuryLocations />
                      </ProtectedRoute>
                    } />
                    <Route path="reports" element={
                      <ProtectedRoute requiredPermission="reports:view">
                        <ReportGenerator />
                      </ProtectedRoute>
                    } />
                    <Route path="documents" element={
                      <ProtectedRoute requiredPermission="documents:view">
                        <DocumentVault />
                      </ProtectedRoute>
                    } />
                    <Route path="assistant" element={
                      <ProtectedRoute requiredPermission="assistant:view">
                        <AIAssistant />
                      </ProtectedRoute>
                    } />
                    <Route path="users" element={
                      <ProtectedRoute requiredPermission="users:manage">
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="settings" element={
                      <ProtectedRoute requiredPermission="settings:manage">
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="audit-logs" element={
                      <ProtectedRoute requiredPermission="logs:view">
                        <AuditLogs />
                      </ProtectedRoute>
                    } />
                    <Route path="help" element={
                      <ProtectedRoute>
                        <HelpSupport />
                      </ProtectedRoute>
                    } />

                    {/* Labour Planning Module Routes */}
                    <Route path="labour-planning" element={
                      <ProtectedRoute>
                        <LabourPlanning />
                      </ProtectedRoute>
                    } />
                    <Route path="labour-planning/reports" element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    <Route path="labour-planning/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="locations" element={
                      <ProtectedRoute>
                        <Locations />
                      </ProtectedRoute>
                    } />

                    {/* Other model placeholder routes */}
                    <Route path="labour-potential" element={
                      <ProtectedRoute>
                        <div className="p-8">
                          <h1 className="text-3xl font-bold">Labour Potential</h1>
                          <p className="mt-4 text-muted-foreground">Coming soon: Workforce potential analysis tools.</p>
                        </div>
                      </ProtectedRoute>
                    } />
                    <Route path="multivariate" element={
                      <ProtectedRoute>
                        <div className="p-8">
                          <h1 className="text-3xl font-bold">Multivariate Optimization</h1>
                          <p className="mt-4 text-muted-foreground">Coming soon: Complex decision optimization tools.</p>
                        </div>
                      </ProtectedRoute>
                    } />
                    <Route path="network" element={
                      <ProtectedRoute>
                        <div className="p-8">
                          <h1 className="text-3xl font-bold">Network Optimization</h1>
                          <p className="mt-4 text-muted-foreground">Coming soon: Supply chain optimization tools.</p>
                        </div>
                      </ProtectedRoute>
                    } />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </MessagingProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
