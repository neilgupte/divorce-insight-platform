import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, FileBarChart, MapPin } from "lucide-react";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SupplyDemandViewProps {
  location: string | null;
  onGenerateReport: () => void;
}

// Mock data
const mockData = {
  pharmacist: {
    demand: 12,
    supply: 15,
    risk: "green",
  },
  technician: {
    demand: 28,
    supply: 18,
    risk: "red",
  }
};

const chartData = [
  {
    role: "Pharmacist",
    Demand: mockData.pharmacist.demand,
    Supply: mockData.pharmacist.supply,
  },
  {
    role: "Technician",
    Demand: mockData.technician.demand,
    Supply: mockData.technician.supply,
  }
];

const SupplyDemandView = ({ location, onGenerateReport }: SupplyDemandViewProps) => {
  const [displayMode, setDisplayMode] = useState<"ftes" | "hours">("ftes");

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      case "amber":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "";
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case "red":
        return "High Risk";
      case "amber":
        return "Medium Risk";
      case "green":
        return "Low Risk";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Supply vs Demand</h1>
          <p className="text-muted-foreground">{location || "No location selected"}</p>
        </div>
        <div className="space-x-3">
          <Button variant="outline" onClick={() => setDisplayMode(displayMode === "ftes" ? "hours" : "ftes")}>
            View in {displayMode === "ftes" ? "Hours" : "FTEs"}
          </Button>
          <Button onClick={onGenerateReport}>
            <FileBarChart className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pharmacist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Required FTEs:</span>
                <span className="font-medium">{mockData.pharmacist.demand}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Supply:</span>
                <span className="font-medium">{mockData.pharmacist.supply}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span>Risk Status:</span>
                <Badge 
                  className={getRiskColor(mockData.pharmacist.risk)}
                  variant="outline"
                >
                  {getRiskLabel(mockData.pharmacist.risk)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Technician</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Required FTEs:</span>
                <span className="font-medium">{mockData.technician.demand}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Supply:</span>
                <span className="font-medium">{mockData.technician.supply}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span>Risk Status:</span>
                <Badge 
                  className={getRiskColor(mockData.technician.risk)}
                  variant="outline"
                >
                  {getRiskLabel(mockData.technician.risk)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Supply data sourced from:</p>
            <div className="border rounded-md p-2 text-xs space-y-1">
              <p>• Bureau of Labor Statistics (BLS)</p>
              <p>• Local Healthcare Authority</p>
              <p>• LinkedIn Workforce Insights</p>
              <p className="text-muted-foreground mt-1">Last updated: Apr 15, 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="chart">
            <BarChart className="h-4 w-4 mr-2" />
            Chart View
          </TabsTrigger>
          <TabsTrigger value="map">
            <MapPin className="h-4 w-4 mr-2" />
            Map View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="border rounded-lg p-4 mt-4">
          <h3 className="font-medium mb-4">Labour Supply vs Demand by Role</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis label={{ 
                  value: displayMode === "ftes" ? "Full Time Equivalents (FTEs)" : "Hours per Week", 
                  angle: -90, 
                  position: "insideLeft" 
                }} />
                <Tooltip />
                <Legend />
                <Bar name="Demand" dataKey="Demand" fill="#ef4444" />
                <Bar name="Supply" dataKey="Supply" fill="#3b82f6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        <TabsContent value="map" className="h-96 border rounded-lg mt-4">
          <div className="h-full flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Interactive map with color-coded ZIP codes would display here
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplyDemandView;
