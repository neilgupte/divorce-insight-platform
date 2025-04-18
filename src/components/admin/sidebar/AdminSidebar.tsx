
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building,
  Package,
  Users,
  CreditCard,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  sidebarCollapsed: boolean;
  toggleCollapse: () => void;
}

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Companies", path: "/admin/companies", icon: Building },
  { name: "Modules", path: "/admin/modules", icon: Package },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Billing", path: "/admin/billing", icon: CreditCard },
  { name: "System Logs", path: "/admin/logs", icon: Activity },
  { name: "Settings", path: "/admin/settings", icon: Settings }
];

export const AdminSidebar = ({ sidebarCollapsed, toggleCollapse }: AdminSidebarProps) => {
  return (
    <div className={cn(
      "w-full md:w-64 bg-purple-900 md:min-h-screen flex-shrink-0 border-r transition-all duration-300 relative",
      sidebarCollapsed ? "md:w-16" : "md:w-64"
    )}>
      <div className="p-6 hidden md:block">
        <h1 className="text-xl font-bold text-white">TBD Corp Admin</h1>
        <p className={cn("text-sm text-purple-200", sidebarCollapsed && "hidden")}>System Management</p>
      </div>

      {/* Toggle collapse button */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleCollapse}
        className="absolute -right-3 top-10 h-6 w-6 rounded-full border bg-background hidden md:flex items-center justify-center shadow-md"
      >
        {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>

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
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  sidebarCollapsed ? "mr-0" : "mr-3"
                )} />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
