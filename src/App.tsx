
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/components/layout/MainLayout";
import { Toaster } from "@/components/ui/toaster";

// Import Dashboard2 component
import Dashboard2 from "./pages/Dashboard2";

// Import NotFound component
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard2" />} />
            <Route path="dashboard2" element={<Dashboard2 />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </ThemeProvider>
    </Router>
  );
};

export default App;
