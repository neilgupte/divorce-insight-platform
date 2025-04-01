
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LuxuryLocation {
  id: number;
  city: string;
  avgValue: string;
  trend: "up" | "down" | "stable";
  change: string;
}

interface LuxuryLocationsCardProps {
  luxuryLocations: LuxuryLocation[];
  onViewAll: () => void;
  isLoading: boolean;
}

const LuxuryLocationsCard: React.FC<LuxuryLocationsCardProps> = ({ 
  luxuryLocations,
  onViewAll,
  isLoading
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          Top Luxury Locations
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">Highest-value areas showing significant high-net-worth divorce activity.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardTitle className="text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            `${luxuryLocations.length} locations`
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-2">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
            <div className="pt-2">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ) : luxuryLocations.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <p>No luxury locations match your filters</p>
            <p className="text-sm">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <>
            <div className="space-y-1 max-h-[270px] overflow-auto pr-2">
              {luxuryLocations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{location.city}</h3>
                    <p className="text-xs text-muted-foreground">Avg. value: {location.avgValue}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded flex items-center space-x-1 ${
                    location.trend === "up" 
                    ? "bg-green-500/10 text-green-500" 
                    : location.trend === "down" 
                      ? "bg-red-500/10 text-red-500" 
                      : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {location.trend === "up" ? "↑" : location.trend === "down" ? "↓" : "→"} {location.change}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={onViewAll}
              >
                View All Locations
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LuxuryLocationsCard;
