
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RegionalMetricsChartProps {
  regionData: Array<{
    name: string;
    netWorth: number;
    divorceRate: number;
    luxuryDensity: number;
  }>;
}

const RegionalMetricsChart: React.FC<RegionalMetricsChartProps> = ({ regionData }) => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Regional Metrics</CardTitle>
        <CardDescription>
          High-net-worth divorce metrics by region
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="netWorth">
          <TabsList className="mb-4">
            <TabsTrigger value="netWorth">Net Worth</TabsTrigger>
            <TabsTrigger value="divorceRate">Divorce Rate</TabsTrigger>
            <TabsTrigger value="luxuryDensity">Luxury Density</TabsTrigger>
          </TabsList>
          <TabsContent value="netWorth">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Millions $", angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `$${value}M`} />
                  <Bar dataKey="netWorth" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="divorceRate">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={regionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Rate %", angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Area type="monotone" dataKey="divorceRate" fill="#F87171" stroke="#EF4444" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="luxuryDensity">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Density", angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="luxuryDensity" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RegionalMetricsChart;
