
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Wrench,
  Layers,
  DollarSign,
  FileBarChart2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/hiring/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Location Analyzer",
    path: "/hiring/location-analyzer",
    icon: Map,
  },
  {
    name: "Hiring Lever Tool",
    path: "/hiring/hiring-lever-tool",
    icon: Wrench,
  },
  {
    name: "Scenario Builder",
    path: "/hiring/scenario-builder",
    icon: Layers,
  },
  {
    name: "Cost Analysis",
    path: "/hiring/cost-analysis",
    icon: DollarSign,
  },
  {
    name: "Impact Reports",
    path: "/hiring/impact-reports",
    icon: FileBarChart2,
  }
];

const HiringSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.path}
                tooltip={item.name}
              >
                <Link to={item.path}>
                  <item.icon className="size-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default HiringSidebar;
