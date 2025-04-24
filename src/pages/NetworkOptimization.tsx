
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Network,
  Users,
  Map,
  GitBranch,
  TrendingUp,
  Brain,
  History,
  HelpCircle
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/network/dashboard",
    description: "Overview of facilities, workforce, and optimization opportunities"
  },
  {
    name: "Facility Network",
    icon: Network,
    path: "/network/facilities",
    description: "Geospatial view of facilities with labor insights"
  },
  {
    name: "Workforce Planner",
    icon: Users,
    path: "/network/workforce",
    description: "Plan and forecast workforce needs per location"
  },
  {
    name: "Coverage Optimizer",
    icon: Map,
    path: "/network/coverage",
    description: "Analyze facility coverage and identify gaps"
  },
  {
    name: "Scenario Simulator",
    icon: GitBranch,
    path: "/network/scenarios",
    description: "Test what-if scenarios for network changes"
  },
  {
    name: "Hiring Efficiency",
    icon: TrendingUp,
    path: "/network/hiring",
    description: "Track recruitment and hiring performance metrics"
  },
  {
    name: "AI Recommendations",
    icon: Brain,
    path: "/network/recommendations",
    description: "Get AI-powered insights and suggestions"
  },
  {
    name: "Audit Logs",
    icon: History,
    path: "/network/logs",
    description: "Review changes and configuration history"
  },
  {
    name: "Help & Support",
    icon: HelpCircle,
    path: "/network/help",
    description: "Access documentation and support"
  }
];

const NetworkOptimization = () => {
  const location = useLocation();

  return (
    <div className="flex h-full">
      <div className="w-64 border-r bg-card">
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "group relative",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
                {/* Tooltip */}
                <div className="absolute left-full ml-2 invisible group-hover:visible bg-popover text-popover-foreground px-3 py-2 rounded-md text-xs w-48 z-50">
                  {item.description}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default NetworkOptimization;
