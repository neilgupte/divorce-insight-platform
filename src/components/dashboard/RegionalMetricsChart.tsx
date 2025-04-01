
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RegionData {
  name: string;
  netWorth: number;
  divorceRate: number;
  luxuryDensity: number;
}

interface RegionalMetricsChartProps {
  regionData: RegionData[];
  isLoading: boolean;
}

const RegionalMetricsChart: React.FC<RegionalMetricsChartProps> = ({ 
  regionData,
  isLoading 
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          Regional Metrics
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">Comparison of key metrics across different U.S. regions based on selected filters.</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </CardTitle>
        <CardTitle className="text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            `${regionData.length} regions`
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="space-y-2 w-full">
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        ) : regionData.length === 0 ? (
          <div className="w-full h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <p>No data available for the selected filters</p>
            <p className="text-sm">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={regionData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#82ca9d"
              />
              <Tooltip formatter={(value, name) => {
                if (name === "netWorth") return [`$${value}M`, "Avg. Net Worth"];
                if (name === "divorceRate") return [`${value}%`, "Divorce Rate"];
                if (name === "luxuryDensity") return [`${value}/km²`, "Luxury Density"];
                return [value, name];
              }} />
              <Legend formatter={(value) => {
                if (value === "netWorth") return "Avg. Net Worth ($M)";
                if (value === "divorceRate") return "Divorce Rate (%)";
                if (value === "luxuryDensity") return "Luxury Density (/km²)";
                return value;
              }} />
              <Bar
                yAxisId="left"
                dataKey="netWorth"
                fill="#8884d8"
                name="netWorth"
                barSize={30}
              />
              <Bar
                yAxisId="right"
                dataKey="divorceRate"
                fill="#82ca9d"
                name="divorceRate"
                barSize={30}
              />
              <Bar
                yAxisId="right"
                dataKey="luxuryDensity"
                fill="#ffc658"
                name="luxuryDensity"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RegionalMetricsChart;
