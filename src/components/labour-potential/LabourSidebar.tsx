import { LayoutDashboard, MapPin, BarChart, FileBarChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
type LabourView = "dashboard" | "search" | "supply-demand" | "reports" | "settings";
interface LabourSidebarProps {
  activeView: LabourView;
  setActiveView: (view: LabourView) => void;
}
const LabourSidebar = ({
  activeView,
  setActiveView
}: LabourSidebarProps) => {
  const menuItems = [{
    id: "dashboard" as LabourView,
    label: "Labour Availability Dashboard",
    icon: LayoutDashboard
  }, {
    id: "search" as LabourView,
    label: "Search Location",
    icon: MapPin
  }, {
    id: "supply-demand" as LabourView,
    label: "Supply vs Demand",
    icon: BarChart
  }, {
    id: "reports" as LabourView,
    label: "Market Reports",
    icon: FileBarChart
  }, {
    id: "settings" as LabourView,
    label: "Settings",
    icon: Settings
  }];
  return;
};
export default LabourSidebar;