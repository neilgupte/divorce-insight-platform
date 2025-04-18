
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, 
  Building, 
  Package, 
  Users, 
  CreditCard, 
  Activity, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Companies", path: "/admin/companies", icon: Building },
    { name: "Modules", path: "/admin/modules", icon: Package },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Billing", path: "/admin/billing", icon: CreditCard },
    { name: "System Logs", path: "/admin/logs", icon: Activity },
    { name: "Settings", path: "/admin/settings", icon: Settings }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile menu button */}
      <div className="md:hidden p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="mr-2"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <span className="font-bold text-lg">TBD Corp Admin</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "w-full md:w-64 bg-card md:min-h-screen flex-shrink-0 border-r transition-all duration-300",
          isMobileMenuOpen ? "block" : "hidden md:block"
        )}
      >
        <div className="p-6 hidden md:block">
          <h1 className="text-xl font-bold">TBD Corp Admin</h1>
          <p className="text-sm text-muted-foreground">System Management</p>
        </div>

        <nav className="mt-2">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="px-2 mt-6">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-start text-destructive" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </nav>
        
        <div className="absolute bottom-4 left-4 hidden md:block">
          <ThemeToggle />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
