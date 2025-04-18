
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdminSidebar } from "./sidebar/AdminSidebar";
import { AdminHeader } from "./header/AdminHeader";
import { AdminUserProfile } from "./profile/AdminUserProfile";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile menu button */}
      <div className="md:hidden p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <span className="font-bold text-lg">TBD Corp Admin</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Sidebar */}
      <div className={cn(sidebarOpen ? "block" : "hidden md:block")}>
        <AdminSidebar 
          sidebarCollapsed={sidebarCollapsed}
          toggleCollapse={toggleCollapse}
        />
        <AdminUserProfile sidebarCollapsed={sidebarCollapsed} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} />
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
