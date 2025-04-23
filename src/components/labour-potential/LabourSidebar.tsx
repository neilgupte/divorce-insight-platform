
import { 
  LayoutDashboard, 
  MapPin, 
  BarChart, 
  FileBarChart, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

type LabourView = "dashboard" | "search" | "supply-demand" | "reports" | "settings";

interface LabourSidebarProps {
  activeView: LabourView;
  setActiveView: (view: LabourView) => void;
}

const LabourSidebar = ({ activeView, setActiveView }: LabourSidebarProps) => {
  const menuItems = [
    {
      id: "dashboard" as LabourView,
      label: "Labour Availability Dashboard",
      icon: LayoutDashboard
    },
    {
      id: "search" as LabourView,
      label: "Search Location",
      icon: MapPin
    },
    {
      id: "supply-demand" as LabourView,
      label: "Supply vs Demand",
      icon: BarChart
    },
    {
      id: "reports" as LabourView,
      label: "Market Reports",
      icon: FileBarChart
    },
    {
      id: "settings" as LabourView,
      label: "Settings",
      icon: Settings
    }
  ];

  return (
    <div className="w-64 border-r bg-background">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-xl">Labour Potential</h2>
      </div>
      <nav className="p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "flex items-center gap-3 w-full p-3 rounded-md text-left mb-1 transition-colors",
              activeView === item.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default LabourSidebar;
