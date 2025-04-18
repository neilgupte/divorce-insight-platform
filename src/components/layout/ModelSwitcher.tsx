
import { Link } from "react-router-dom";
import { LayoutDashboard, Network, Brain, Users, GitBranch, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const models = [
  {
    id: "realestate",
    name: "Real Estate IQ",
    description: "AI-powered real estate analysis and valuation platform",
    icon: Brain,
    path: "/dashboard",
  },
  {
    id: "labour-planning",
    name: "Labour Planning",
    description: "Optimize workforce allocation and scheduling",
    icon: Users,
    path: "/labour-planning",
  },
  {
    id: "labour-potential",
    name: "Labour Potential",
    description: "Analyze and maximize workforce potential",
    icon: LayoutDashboard,
    path: "/labour-potential",
  },
  {
    id: "multivariate",
    name: "Multivariate Optimization",
    description: "Complex decision optimization engine",
    icon: GitBranch,
    path: "/multivariate",
  },
  {
    id: "network",
    name: "Network Optimization",
    description: "Supply chain and network flow optimization",
    icon: Network,
    path: "/network",
  },
];

export function ModelSwitcher() {
  // Get the current user to ensure they have access to the selected module
  const { user } = useAuth();
  const activeModel = "realestate"; // Default to Real Estate IQ
  
  // Filter models based on user's access
  const availableModels = user ? models.filter(model => 
    !user.modules || user.modules.includes(model.id)
  ) : models;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start px-4 py-2 text-left text-xl font-bold text-white hover:bg-sidebar-accent group"
        >
          <span className="flex items-center">
            {models.find(m => m.id === activeModel)?.name || "Real Estate IQ"}
            <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[300px] p-3"
        sideOffset={8}
      >
        <div className="grid gap-3">
          {availableModels.map((model) => (
            <Link
              key={model.name}
              to={model.path}
              className="flex items-start gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-accent"
            >
              <model.icon className="h-5 w-5" />
              <div>
                <div className="font-medium">{model.name}</div>
                <div className="text-muted-foreground line-clamp-1">
                  {model.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
