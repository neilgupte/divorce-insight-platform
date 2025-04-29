
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TabsContent } from "@/components/ui/tabs";

// Sample data for the charts
const networkPerformanceData = [
  { month: "Jan", cost: 4000, efficiency: 65, deliveryTime: 2.4 },
  { month: "Feb", cost: 3500, efficiency: 68, deliveryTime: 2.2 },
  { month: "Mar", cost: 3800, efficiency: 70, deliveryTime: 2.0 },
  { month: "Apr", cost: 4200, efficiency: 72, deliveryTime: 1.9 },
  { month: "May", cost: 3900, efficiency: 75, deliveryTime: 1.8 },
  { month: "Jun", cost: 3700, efficiency: 78, deliveryTime: 1.7 },
];

const NetworkDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Network Optimization Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Analyze and optimize your supply chain network
      </p>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Network Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={networkPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="efficiency" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2">Network efficiency trends and key performance indicators.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={networkPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cost" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2">Cost breakdown and optimization opportunities.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transportation Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={networkPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="deliveryTime" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2">Transportation route efficiency and delivery times.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Network Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Distribution Centers</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Manufacturing Facilities</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Warehouses</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Retail Locations</span>
                <span className="font-bold">47</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Optimization Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Consolidate Northeast warehouses (potential 12% savings)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Optimize Western route transportation (potential 8% savings)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span>Review Southern distribution centers capacity</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span>Address Midwest delivery delays</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkDashboard;
