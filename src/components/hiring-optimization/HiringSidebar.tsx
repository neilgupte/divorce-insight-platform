
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Map,
  Tool,
  Layers,
  DollarSign,
  TrendingUp,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface HiringSidebarProps {
  sidebarCollapsed: boolean;
  toggleCollapse: () => void;
}

const menuItems = [
  { name: "Dashboard", path: "/hiring/dashboard", icon: LayoutDashboard },
  { name: "Location Analyzer", path: "/hiring/location-analyzer", icon: Map },
  { name: "Hiring Lever Tool", path: "/hiring/hiring-lever-tool", icon: Tool },
  { name: "Scenario Builder", path: "/hiring/scenario-builder", icon: Layers },
  { name: "Cost Analysis", path: "/hiring/cost-analysis", icon: DollarSign },
  { name: "Impact Reports", path: "/hiring/impact-reports", icon: TrendingUp },
  { name: "Help & Support", path: "/hiring/help-support", icon: HelpCircle }
];

export const HiringSidebar = ({ sidebarCollapsed, toggleCollapse }: HiringSidebarProps) => {
  return (
    <div className={cn(
      "bg-purple-900 md:min-h-screen flex-shrink-0 border-r transition-all duration-300 relative",
      sidebarCollapsed ? "md:w-16" : "md:w-64"
    )}>
      <div className="p-6 hidden md:block">
        <h1 className={cn(
          "text-xl font-bold text-white truncate",
          sidebarCollapsed && "text-center"
        )}>
          {!sidebarCollapsed ? "Hiring Optimization" : "HO"}
        </h1>
        <p className={cn("text-sm text-purple-200", sidebarCollapsed && "hidden")}>
          Optimize your hiring
        </p>
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
