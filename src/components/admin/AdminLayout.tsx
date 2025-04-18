
import { useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import MessagingCenter from "@/components/messaging/MessagingCenter";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
      <div
        className={cn(
          "w-full md:w-64 bg-purple-900 md:min-h-screen flex-shrink-0 border-r transition-all duration-300",
          sidebarOpen ? "block" : "hidden md:block",
          sidebarCollapsed ? "md:w-16" : "md:w-64"
        )}
      >
        <div className="p-6 hidden md:block">
          <h1 className="text-xl font-bold text-white">TBD Corp Admin</h1>
          <p className="text-sm text-purple-200">System Management</p>
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
                      ? "bg-purple-800 text-white"
                      : "text-purple-100 hover:bg-purple-800/50"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    sidebarCollapsed ? "mr-0" : "mr-3"
                  )} />
                  {!sidebarCollapsed && item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile at bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2 text-white hover:bg-purple-800/50">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{user?.name || "Admin User"}</span>
                    <span className="text-xs text-purple-200">{user?.role || "Administrator"}</span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-2 ml-auto">
              <ThemeToggle />
              <NotificationCenter />
              <MessagingCenter />
            </div>
          </div>
        </header>

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
