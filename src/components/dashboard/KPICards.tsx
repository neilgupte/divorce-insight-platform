
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus, DollarSign, BarChart3, Home, AlertTriangle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KPICardProps {
  title: string;
  value: string | number;
  change: {
    value: number;
    type: 'increase' | 'decrease' | 'unchanged';
  };
  icon: React.ReactNode;
  tooltipText: string;
  isLoading: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  tooltipText,
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold transition-all duration-500">
              {typeof value === 'number' ? value.toFixed(1) : value}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${
                change.type === 'increase' 
                  ? 'text-green-500' 
                  : change.type === 'decrease' 
                    ? 'text-red-500'
                    : 'text-amber-500'
              }`}>
                {change.type === 'increase' ? (
                  <ArrowUp className="mr-1 h-4 w-4" />
                ) : change.type === 'decrease' ? (
                  <ArrowDown className="mr-1 h-4 w-4" />
                ) : (
                  <Minus className="mr-1 h-4 w-4" />
                )}
                {change.value}%
              </span>{" "}
              {change.type === 'increase' 
                ? 'increase from last year' 
                : change.type === 'decrease'
                  ? 'decrease from last year'
                  : 'similar to last year'
              }
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

interface KPICardsProps {
  isLoading: boolean;
  metrics: {
    netWorth: number;
    divorceRate: number;
    luxuryDensity: number;
    protectionRate: number;
  };
}

const KPICards: React.FC<KPICardsProps> = ({ isLoading, metrics }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Avg. Net Worth"
        value={`$${metrics.netWorth.toFixed(1)}M`}
        change={{
          value: 12,
          type: 'increase'
        }}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        tooltipText="Average net worth of individuals in the selected region and bracket."
        isLoading={isLoading}
      />
      
      <KPICard
        title="HNW Divorce Rate"
        value={`${metrics.divorceRate.toFixed(1)}%`}
        change={{
          value: 4,
          type: 'increase'
        }}
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        tooltipText="Percentage of high-net-worth marriages ending in divorce annually in the selected region."
        isLoading={isLoading}
      />
      
      <KPICard
        title="Luxury Property Density"
        value={`${metrics.luxuryDensity.toFixed(1)}/km²`}
        change={{
          value: 8,
          type: 'increase'
        }}
        icon={<Home className="h-4 w-4 text-muted-foreground" />}
        tooltipText="Number of luxury properties per square kilometer in the selected region."
        isLoading={isLoading}
      />
      
      <KPICard
        title="Asset Protection Rate"
        value={`${metrics.protectionRate.toFixed(0)}%`}
        change={{
          value: 1,
          type: 'unchanged'
        }}
        icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        tooltipText="Percentage of high-net-worth individuals with comprehensive asset protection strategies in place."
        isLoading={isLoading}
      />
    </div>
  );
};

export default KPICards;
