import { NavLink } from "react-router-dom";
import { LayoutDashboard, MapPin, BarChart, FileBarChart, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/labour-potential/dashboard"
  },
  {
    id: "search",
    label: "Search Location",
    icon: MapPin,
    path: "/labour-potential/search"
  },
  {
    id: "supply-vs-demand",
    label: "Supply vs Demand",
    icon: BarChart,
    path: "/labour-potential/supply-vs-demand"
  },
  {
    id: "reports",
    label: "Market Reports",
    icon: FileBarChart,
    path: "/labour-potential/reports"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/labour-potential/settings"
  },
  {
    id: "help",
    label: "Help & Support",
    icon: HelpCircle,
    path: "/help"
  }
];

const LabourSidebar = () => {
  return (
    <div className="bg-sidebar text-sidebar-foreground w-64 min-h-full p-4 space-y-4">
      <div className="text-xl font-bold mb-2 px-2">Labour Potential</div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default LabourSidebar;
