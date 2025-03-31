import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Minus, DollarSign, BarChart3, Home, AlertTriangle, Info } from "lucide-react";
import { 
  REGIONAL_METRICS, 
  TOP_LUXURY_LOCATIONS, 
  AI_INSIGHTS, 
  US_STATES, 
  TOP_CITIES, 
  NET_WORTH_BRACKETS 
} from "@/data/mockData";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [selectedNetWorth, setSelectedNetWorth] = useState<string>("All");

  // Filter cities based on selected state
  const availableCities = selectedState !== "All States" && TOP_CITIES[selectedState] 
    ? ["All Cities", ...TOP_CITIES[selectedState]] 
    : ["All Cities"];

  // Sample heatmap data - in a real app, this would come from your backend
  const mapData = [
    { id: "CA", value: 8.7 },
    { id: "NY", value: 9.2 },
    { id: "FL", value: 7.8 },
    { id: "TX", value: 6.5 },
    { id: "IL", value: 5.9 },
    // ... other states
  ];

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Sample chart data
  const regionData = REGIONAL_METRICS.map(item => ({
    name: item.region,
    netWorth: item.avgNetWorth / 1000000, // Convert to millions
    divorceRate: item.divorceRate,
    luxuryDensity: item.luxuryDensity
  }));

  // Transform data for pie chart
  const pieData = TOP_LUXURY_LOCATIONS.map(location => ({
    name: location.city.split(',')[0],
    value: location.density
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of high-net-worth divorce metrics across the United States
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger>
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All States">All States</SelectItem>
            {US_STATES.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {availableCities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedNetWorth} onValueChange={setSelectedNetWorth}>
          <SelectTrigger>
            <SelectValue placeholder="Net Worth Bracket" />
          </SelectTrigger>
          <SelectContent>
            {NET_WORTH_BRACKETS.map(bracket => (
              <SelectItem key={bracket} value={bracket}>{bracket}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
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

      {/* Main content area */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Regional Metrics */}
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

        {/* Top Luxury Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Luxury Locations</CardTitle>
            <CardDescription>
              Areas with highest luxury property density
            </CardDescription>
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
                  {TOP_LUXURY_LOCATIONS.map((location, index) => (
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

        {/* US Map - Placeholder */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>U.S. High-Net-Worth Divorce Heatmap</CardTitle>
            <CardDescription>
              Interactive map showing divorce rates by state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-80 items-center justify-center bg-muted/20 rounded-md">
              <div className="text-center">
                <p className="mb-2 text-sm text-muted-foreground">Mapbox integration would go here</p>
                <p className="text-xs text-muted-foreground">Shows interactive heatmap of divorce rates across the US</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>
              Machine learning detected patterns and anomalies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {AI_INSIGHTS.map((insight) => (
                <div key={insight.id} className="rounded-lg border bg-card p-4">
                  <div className="mb-2 flex items-center">
                    <div className="mr-2">
                      {insight.severity === "high" ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Info className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <h3 className="font-semibold">{insight.title}</h3>
                    <div className="ml-auto">
                      <Badge variant={insight.trend === "increasing" ? "destructive" : "outline"}>
                        {insight.trend === "increasing" 
                          ? <ArrowUp className="mr-1 h-3 w-3 inline" /> 
                          : insight.trend === "decreasing" 
                            ? <ArrowDown className="mr-1 h-3 w-3 inline" /> 
                            : <Minus className="mr-1 h-3 w-3 inline" />}
                        {insight.trend}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
