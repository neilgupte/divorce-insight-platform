
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Map, FileText, FileBox, MessageCircle, Activity } from "lucide-react";

interface MainNavigationMenuProps {
  sidebarCollapsed: boolean;
  hasPermission: (permission: string) => boolean;
  userRole?: string;
}

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    permission: "dashboard:view"
  },
  {
    name: "Location Analyzer",
    icon: Map,
    path: "/location",
    permission: "location:view"
  },
  {
    name: "Report Generator",
    icon: FileText,
    path: "/reports",
    permission: "reports:view"
  },
  {
    name: "Document Vault",
    icon: FileBox,
    path: "/documents",
    permission: "documents:view"
  },
  {
    name: "AI Assistant",
    icon: MessageCircle,
    path: "/assistant",
    permission: "assistant:view"
  },
  {
    name: "Audit Logs",
    icon: Activity,
    path: "/audit-logs",
    permission: "logs:view"
  }
];

export const MainNavigationMenu = ({ sidebarCollapsed, hasPermission, userRole }: MainNavigationMenuProps) => {
  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.permission) || userRole === 'superuser'
  );

  return (
    <nav className="mt-2">
      <ul className="space-y-1 px-2">
        {filteredMenuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
  );
};
