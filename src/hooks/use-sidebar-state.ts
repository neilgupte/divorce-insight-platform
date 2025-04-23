
import { useState } from "react";

export const useSidebarState = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    toggleCollapse
  };
};
