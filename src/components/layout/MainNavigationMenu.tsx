import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Map,
  FileText,
  FileBox,
  MessageCircle,
  Activity,
  Clock,
  GitBranch,
  Users,
  Network,
  Settings as SettingsIcon,
  HelpCircle,
  MapPin,
  Shuffle
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
    { name: "Audit Logs", icon: Activity, path: "/audit-logs", permission: "logs:view" },
    { name: "User Management", icon: Users, path: "/user-management", permission: "users:view" },
    { name: "Settings", icon: SettingsIcon, path: "/settings", permission: "settings:view" },
    { name: "Help & Support", icon: HelpCircle, path: "/help", permission: "help:view" },
  ],
  "labour-planning": [
    { name: "Dashboard", icon: LayoutDashboard, path: "/labour-planning/dashboard", permission: "dashboard:view" },
    { name: "Create Labour Model", icon: Clock, path: "/labour-planning/create-model", permission: "models:create" },
    { name: "Task Mapping", icon: Shuffle, path: "/labour-planning/task-mapping", permission: "mapping:view" },
    { name: "Model Runs", icon: GitBranch, path: "/labour-planning/runs", permission: "runs:view" },
    { name: "Locations", icon: MapPin, path: "/labour-planning/locations", permission: "locations:view" },
    { name: "Settings", icon: SettingsIcon, path: "/labour-planning/settings", permission: "settings:view" },
    { name: "Help & Support", icon: HelpCircle, path: "/help", permission: "help:view" },
  ],
  "labour-potential": [
    { name: "Dashboard", icon: LayoutDashboard, path: "/labour-potential/dashboard", permission: "dashboard:view" },
    { name: "Search Location", icon: Map, path: "/labour-potential/search", permission: "location:view" },
    { name: "Supply vs Demand", icon: FileText, path: "/labour-potential/supply-vs-demand", permission: "reports:view" },
    { name: "Market Reports", icon: FileBox, path: "/labour-potential/reports", permission: "documents:view" },
    { name: "Settings", icon: SettingsIcon, path: "/labour-potential/settings", permission: "settings:view" },
    { name: "Help & Support", icon: HelpCircle, path: "/help", permission: "help:view" },
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
              <item.icon className={cn("h-5 w-5", sidebarCollapsed ? "mr-0" : "mr-3")} />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

