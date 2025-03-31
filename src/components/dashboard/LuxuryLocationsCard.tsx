
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface LuxuryLocation {
  city: string;
  density: number;
  avgValue: string;
}

interface LuxuryLocationsCardProps {
  luxuryLocations: LuxuryLocation[];
  onViewAll: () => void;
}

const LuxuryLocationsCard: React.FC<LuxuryLocationsCardProps> = ({ 
  luxuryLocations, 
  onViewAll 
}) => {
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Transform data for pie chart
  const pieData = luxuryLocations.slice(0, 5).map(location => ({
    name: location.city.split(',')[0],
    value: location.density
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Luxury Locations</CardTitle>
          <CardDescription>
            Areas with highest luxury property density
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onViewAll}
        >
          <span>View All</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left">Location</th>
                <th className="pb-2 text-right">Density</th>
                <th className="pb-2 text-right">Avg Value</th>
              </tr>
            </thead>
            <tbody>
              {luxuryLocations.slice(0, 5).map((location, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{location.city}</td>
                  <td className="py-2 text-right">{location.density}</td>
                  <td className="py-2 text-right">{location.avgValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LuxuryLocationsCard;
