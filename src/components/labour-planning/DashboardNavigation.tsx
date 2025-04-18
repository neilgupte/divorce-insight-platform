
import { 
  LayoutDashboard, 
  BarChart2, 
  Users, 
  MapPin,
  Settings
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function DashboardNavigation() {
  // Get the current URL to determine which link is active
  const currentUrl = window.location.pathname;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={currentUrl.includes("/labour-planning/dashboard")}>
          <a href="/labour-planning/dashboard">
            <LayoutDashboard />
            <span>Dashboard</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={currentUrl.includes("/labour-planning/reports")}>
          <a href="/labour-planning/reports">
            <BarChart2 />
            <span>Reports</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={currentUrl === "/labour-planning"}>
          <a href="/labour-planning">
            <Users />
            <span>Labour Planning</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={currentUrl.includes("/locations")}>
          <a href="/locations">
            <MapPin />
            <span>Locations</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={currentUrl.includes("/settings")}>
          <a href="/settings">
            <Settings />
            <span>Settings</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
