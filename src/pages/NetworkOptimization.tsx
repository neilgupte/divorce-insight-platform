
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
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
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-[240px,1fr]">
        {/* Network Navigation Sidebar */}
        <aside className="border-r bg-card">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="min-h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Default export with redirect to dashboard
export default function NetworkOptimizationWithRedirect() {
  // If we're exactly at /network, redirect to /network/dashboard
  if (window.location.pathname === '/network') {
    return <Navigate to="/network/dashboard" replace />;
  }
  
  return <NetworkOptimization />;
}
