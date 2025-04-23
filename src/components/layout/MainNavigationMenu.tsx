// MainNavigationMenu.tsx
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Map,
  FileText,
  FileBox,
  MessageCircle,
  Activity,
  BarChart2,
  Settings as SettingsIcon
} from "lucide-react";

interface MainNavigationMenuProps {
  sidebarCollapsed: boolean;
  hasPermission: (permission: string) => boolean;
  userRole?: string;
  module: "real-estate-iq" | "labour-potential" | "labour-planning";
}

const menuItemsByModule = {
  "real-estate-iq": [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", permission: "dashboard:view" },
    { name: "Location Analyzer", icon: Map, path: "/location", permission: "location:view" },
    { name: "Report Generator", icon: FileText, path: "/reports", permission: "reports:view" },
    { name: "Document Vault", icon: FileBox, path: "/documents", permission: "documents:view" },
    { name: "AI Assistant", icon: MessageCircle, path: "/assistant", permission: "assistant:view" },
    { name: "Audit Logs", icon: Activity, path: "/audit-logs", permission: "logs:view" }
  ],
  "labour-potential": [
    { name: "Dashboard", icon: LayoutDashboard, path: "/labour-potential/dashboard", permission: "dashboard:view" },
    { name: "Search Location", icon: Map, path: "/labour-potential/search", permission: "location:view" },
    { name: "Supply vs Demand", icon: BarChart2, path: "/labour-potential/supply-vs-demand", permission: "reports:view" },
    { name: "Market Reports", icon: FileBox, path: "/labour-potential/reports", permission: "documents:view" },
    { name: "Settings", icon: SettingsIcon, path: "/labour-potential/settings", permission: "logs:view" }
  ]
};

export const MainNavigationMenu = ({
  sidebarCollapsed,
  hasPermission,
  userRole,
  module
}: MainNavigationMenuProps) => {
  const moduleMenu = menuItemsByModule[module] || [];
  const filteredMenuItems = moduleMenu.filter(
    (item) => hasPermission(item.permission) || userRole === "superuser"
  );

  return (
    <nav className="mt-2">
      <ul className="space-y-1 px-2">
        {filteredMenuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon
                className={cn("h-5 w-5", sidebarCollapsed ? "mr-0" : "mr-3")}
              />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
