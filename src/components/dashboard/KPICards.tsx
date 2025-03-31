
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus, DollarSign, BarChart3, Home, AlertTriangle } from "lucide-react";

const KPICards: React.FC = () => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Net Worth</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$14.2M</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center text-green-500">
              <ArrowUp className="mr-1 h-4 w-4" />
              12%
            </span>{" "}
            increase from last year
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">HNW Divorce Rate</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5.8%</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center text-red-500">
              <ArrowUp className="mr-1 h-4 w-4" />
              4%
            </span>{" "}
            increase from last year
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Luxury Property Density</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">6.2/km²</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center text-green-500">
              <ArrowUp className="mr-1 h-4 w-4" />
              8%
            </span>{" "}
            increase from last year
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Asset Protection Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">38%</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center text-amber-500">
              <Minus className="mr-1 h-4 w-4" />
              1%
            </span>{" "}
            similar to last year
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
