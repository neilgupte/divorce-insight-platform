import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Map, Table, Maximize, SlidersHorizontal } from "lucide-react";
import NetworkMap from "./NetworkMap";
import InsightsPanel from "./InsightsPanel";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import FullscreenMapDialog from "./FullscreenMapDialog";
import { Slider } from "@/components/ui/slider";

// Sample data for the charts and facilities
const networkPerformanceData = [
  { month: "Jan", cost: 4000, efficiency: 65, deliveryTime: 2.4 },
  { month: "Feb", cost: 3500, efficiency: 68, deliveryTime: 2.2 },
  { month: "Mar", cost: 3800, efficiency: 70, deliveryTime: 2.0 },
  { month: "Apr", cost: 4200, efficiency: 72, deliveryTime: 1.9 },
  { month: "May", cost: 3900, efficiency: 75, deliveryTime: 1.8 },
  { month: "Jun", cost: 3700, efficiency: 78, deliveryTime: 1.7 },
];

const mockFacilities = [
  {
    id: "1",
    name: "Downtown Distribution Center",
    type: "Distribution",
    workers: 145,
    neededWorkers: 15,
    utilisation: 0.91,
    attrition: 0.12,
    commuteTime: 28,
    lat: 37.7749,
    lng: -122.4194,
    marginalValue: 0.87,
    laborPoolIndex: 0.76
  },
  {
    id: "2",
    name: "Eastside Fulfillment",
    type: "Fulfillment",
    workers: 78,
    neededWorkers: 23,
    utilisation: 0.77,
    attrition: 0.18,
    commuteTime: 35,
    lat: 37.8044,
    lng: -122.2712,
    marginalValue: 0.65,
    laborPoolIndex: 0.62
  },
  {
    id: "3",
    name: "South Bay Storage",
    type: "Storage",
    workers: 92,
    neededWorkers: 8,
    utilisation: 0.89,
    attrition: 0.08,
    commuteTime: 22,
    lat: 37.3382,
    lng: -121.8863,
    marginalValue: 0.92,
    laborPoolIndex: 0.88
  },
  {
    id: "4",
    name: "North County Logistics",
    type: "Logistics",
    workers: 112,
    neededWorkers: 0,
    utilisation: 1.0,
    attrition: 0.15,
    commuteTime: 31,
    lat: 38.1499,
    lng: -122.4569,
    marginalValue: 0.79,
    laborPoolIndex: 0.71
  },
  {
    id: "5",
    name: "Central Valley Distribution",
    type: "Distribution",
    workers: 65,
    neededWorkers: 30,
    utilisation: 0.68,
    attrition: 0.22,
    commuteTime: 42,
    lat: 37.9577,
    lng: -121.2908,
    marginalValue: 0.58,
    laborPoolIndex: 0.55
  }
];

const NetworkDashboard = () => {
  const [maxRadius, setMaxRadius] = useState<number>(30);
  const [selectedInsight, setSelectedInsight] = useState<"network" | "facility" | "scenario">("network");
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [visibleFacilities, setVisibleFacilities] = useState(
    mockFacilities.map(f => f.id)
  );
  const [isFullscreenMapOpen, setIsFullscreenMapOpen] = useState(false);
  const [showMapFilters, setShowMapFilters] = useState(false);
  
  const totalWorkers = mockFacilities.reduce((sum, f) => sum + f.workers, 0);
  const totalNeeded = mockFacilities.reduce((sum, f) => sum + f.neededWorkers, 0);
  const avgCommuteTime = Math.round(
    mockFacilities.reduce((sum, f) => sum + f.commuteTime, 0) / mockFacilities.length
  );
  const networkEfficiency = 76; // Example calculated value
  
  const toggleFacilityVisibility = (id: string) => {
    setVisibleFacilities(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">Network Optimization</h1>
          <p className="text-muted-foreground">
            Optimize your facility network & workforce distribution
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/network/dashboard">
            <Button variant="default" className="flex items-center gap-1" size="sm">
              <Map className="h-4 w-4" />
              Map View
            </Button>
          </Link>
          <Link to="/network/table">
            <Button variant="outline" className="flex items-center gap-1" size="sm">
              <Table className="h-4 w-4" />
              Table View
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="flex items-center gap-1" 
            size="sm"
            onClick={() => setIsFullscreenMapOpen(true)}
          >
            <Maximize className="h-4 w-4" />
            Expand Map
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Card */}
        <Card className="h-[500px] overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Facility Network Map</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-1 text-muted-foreground"
                  onClick={() => setShowMapFilters(!showMapFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {showMapFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <div className="text-sm text-muted-foreground">
                  {mockFacilities.length} facilities, {totalWorkers} workers total
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative">
            <NetworkMap 
              facilities={mockFacilities.filter(f => visibleFacilities.includes(f.id))}
              layers={{ commuteRadii: true }}
              maxRadius={maxRadius}
              selectedFacility={selectedFacility}
              onSelectFacility={setSelectedFacility}
            />

            {showMapFilters && (
              <div className="absolute bottom-4 left-4 w-72 bg-background/90 backdrop-blur-sm p-4 rounded-md border shadow-sm">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Distance Filter (mi)</span>
                    <span>{maxRadius}</span>
                  </div>
                  <Slider
                    value={[maxRadius]}
                    min={5}
                    max={50}
                    step={1}
                    onValueChange={(value) => setMaxRadius(value[0])}
                    className="my-2"
                  />
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">Show Facilities</div>
                  <div className="space-y-1">
                    {mockFacilities.map((facility) => (
                      <div key={facility.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`facility-${facility.id}`}
                          checked={visibleFacilities.includes(facility.id)}
                          onChange={() => toggleFacilityVisibility(facility.id)}
                          className="mr-2 h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={`facility-${facility.id}`} className="text-sm">
                          {facility.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {selectedFacility && (
              <div className="absolute bottom-4 right-4 w-64 bg-background/90 backdrop-blur-sm p-4 rounded-md border shadow-sm">
                <h3 className="font-medium">{selectedFacility.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedFacility.type}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Workers</p>
                    <p className="font-medium">{selectedFacility.workers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Utilization</p>
                    <p className="font-medium">{Math.round(selectedFacility.utilisation * 100)}%</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setSelectedFacility(null)}
                >
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Facility Overview Card */}
        <Card className="h-[500px] overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Facility Overview</CardTitle>
              <div className="text-sm text-muted-foreground">
                {mockFacilities.length} facilities, {totalWorkers} workers total
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search facilities..."
                className="pl-8 mb-4"
              />
            </div>
            <div className="overflow-auto h-[360px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b">
                    <th className="text-left font-medium py-2">Facility</th>
                    <th className="text-right font-medium py-2">Workers</th>
                    <th className="text-right font-medium py-2">Needed</th>
                    <th className="text-right font-medium py-2">Utilisation</th>
                    <th className="text-right font-medium py-2">Attrition</th>
                    <th className="text-right font-medium py-2">Commute</th>
                  </tr>
                </thead>
                <tbody>
                  {mockFacilities.map((facility) => (
                    <tr 
                      key={facility.id} 
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedFacility(facility)}
                    >
                      <td className="py-3">
                        <div className="font-medium">{facility.name}</div>
                        <div className="text-xs text-muted-foreground">{facility.type}</div>
                      </td>
                      <td className="text-right">{facility.workers}</td>
                      <td className="text-right">{facility.neededWorkers}</td>
                      <td className="text-right">
                        <span className={`${
                          facility.utilisation >= 0.9 ? 'text-green-500' :
                          facility.utilisation >= 0.7 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {Math.round(facility.utilisation * 100)}%
                        </span>
                      </td>
                      <td className="text-right">
                        <span className={`${
                          facility.attrition <= 0.1 ? 'text-green-500' :
                          facility.attrition <= 0.18 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {Math.round(facility.attrition * 100)}%
                        </span>
                      </td>
                      <td className="text-right">{facility.commuteTime} mins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="network" onValueChange={(value) => setSelectedInsight(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="network">Network Insights</TabsTrigger>
              <TabsTrigger value="facility">Facility Analysis</TabsTrigger>
              <TabsTrigger value="scenario">Run Scenario</TabsTrigger>
            </TabsList>
            
            <InsightsPanel 
              selectedFacility={selectedFacility} 
              facilities={mockFacilities}
              initialInsightType={selectedInsight}
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">{mockFacilities.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Facilities</div>
              <div className="mt-2 text-xs text-muted-foreground">1 at high utilization</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">{totalWorkers}</div>
              <div className="text-sm text-muted-foreground mt-1">Workforce</div>
              <div className="mt-2 text-xs text-muted-foreground">70 needed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">{avgCommuteTime} mins</div>
              <div className="text-sm text-muted-foreground mt-1">Avg Commute Time</div>
              <div className="mt-2 text-xs text-muted-foreground">-3.0% last month</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">{networkEfficiency}%</div>
              <div className="text-sm text-muted-foreground mt-1">Network Efficiency</div>
              <div className="mt-2 text-xs text-muted-foreground">+2.5% last quarter</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fullscreen Map Dialog */}
      <FullscreenMapDialog 
        open={isFullscreenMapOpen} 
        onOpenChange={setIsFullscreenMapOpen}
        facilities={mockFacilities}
        selectedFacility={selectedFacility}
        onSelectFacility={setSelectedFacility}
      />
    </div>
  );
};

export default NetworkDashboard;
