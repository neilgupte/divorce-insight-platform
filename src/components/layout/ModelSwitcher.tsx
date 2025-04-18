
import { LayoutDashboard, Network, Brain, Users, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const models = [
  {
    name: "DivorceIQ",
    description: "AI-powered divorce settlement and analysis platform",
    icon: Brain,
    path: "/",
  },
  {
    name: "Labour Planning",
    description: "Optimize workforce allocation and scheduling",
    icon: Users,
    path: "/labour-planning",
  },
  {
    name: "Labour Potential",
    description: "Analyze and maximize workforce potential",
    icon: LayoutDashboard,
    path: "/labour-potential",
  },
  {
    name: "Multivariate Optimization",
    description: "Complex decision optimization engine",
    icon: GitBranch,
    path: "/multivariate",
  },
  {
    name: "Network Optimization",
    description: "Supply chain and network flow optimization",
    icon: Network,
    path: "/network",
  },
];

export function ModelSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start px-4 py-2 text-left text-xl font-bold text-white hover:bg-sidebar-accent"
        >
          DivorceIQ
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[300px] p-3"
        sideOffset={8}
      >
        <div className="grid gap-3">
          {models.map((model) => (
            <a
              key={model.name}
              href={model.path}
              className="flex items-start gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-accent"
            >
              <model.icon className="h-5 w-5" />
              <div>
                <div className="font-medium">{model.name}</div>
                <div className="text-muted-foreground line-clamp-1">
                  {model.description}
                </div>
              </div>
            </a>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
