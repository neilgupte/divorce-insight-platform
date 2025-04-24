
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Layers, Building, Cpu, Users, Clock, PieChart, MapPin } from "lucide-react";
import NetworkMap from "./NetworkMap";
import FacilityTable from "./FacilityTable";
import InsightsPanel from "./InsightsPanel";

interface Facility {
  id: string;
  name: string;
  workers: number;
  neededWorkers: number;
  marginalValue: number;
  utilisation: number;
  attrition: number;
  commuteTime: number;
  laborPoolIndex: number;
  type: string;
  lat: number;
  lng: number;
}

const mockFacilities: Facility[] = [
  {
    id: "1",
    name: "Downtown Distribution Center",
    workers: 145,
    neededWorkers: 15,
    marginalValue: 0.87,
    utilisation: 0.91,
    attrition: 0.12,
    commuteTime: 28,
    laborPoolIndex: 0.76,
    type: "Distribution",
    lat: 37.7749,
    lng: -122.4194
  },
  {
    id: "2",
    name: "Eastside Fulfillment",
    workers: 78,
    neededWorkers: 23,
    marginalValue: 0.65,
    utilisation: 0.77,
    attrition: 0.18,
    commuteTime: 35,
    laborPoolIndex: 0.62,
    type: "Fulfillment",
    lat: 37.8044,
    lng: -122.2712
  },
  {
    id: "3",
    name: "South Bay Storage",
    workers: 92,
    neededWorkers: 8,
    marginalValue: 0.92,
    utilisation: 0.89,
    attrition: 0.08,
    commuteTime: 22,
    laborPoolIndex: 0.88,
    type: "Storage",
    lat: 37.3382,
    lng: -121.8863
  },
  {
    id: "4",
    name: "North County Logistics",
    workers: 112,
    neededWorkers: 0,
    marginalValue: 0.79,
    utilisation: 1.0,
    attrition: 0.15,
    commuteTime: 31,
    laborPoolIndex: 0.71,
    type: "Logistics",
    lat: 38.1499,
    lng: -122.4569
  },
  {
    id: "5",
    name: "Central Valley Distribution",
    workers: 65,
    neededWorkers: 30,
    marginalValue: 0.58,
    utilisation: 0.68,
    attrition: 0.22,
    commuteTime: 42,
    laborPoolIndex: 0.55,
    type: "Distribution",
    lat: 37.9577,
    lng: -121.2908
  }
];

const NetworkDashboard = () => {
  const [facilities] = useState<Facility[]>(mockFacilities);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeView, setActiveView] = useState<string>("map");
  const [mapLayers, setMapLayers] = useState({
    facilities: true,
    commuteRadii: true,
    populationDensity: false,
    laborHeatmap: true
  });

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
  };

  const toggleMapLayer = (layer: keyof typeof mapLayers) => {
    setMapLayers({
      ...mapLayers,
      [layer]: !mapLayers[layer]
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network Optimization</h1>
          <p className="text-muted-foreground">
            Optimize your facility network and workforce distribution
          </p>
        </div>
        <Tabs value={activeView} onValueChange={setActiveView} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">
              <MapPin className="mr-2 h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="table">
              <Building className="mr-2 h-4 w-4" />
              Table View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Interactive Map Section - 60% width */}
        <Card className="col-span-3 h-[500px] overflow-hidden">
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Facility Network Map</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleMapLayer('facilities')}
                  className={`px-2 py-1 rounded-md text-xs ${mapLayers.facilities ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  Facilities
                </button>
                <button
                  onClick={() => toggleMapLayer('commuteRadii')}
                  className={`px-2 py-1 rounded-md text-xs ${mapLayers.commuteRadii ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  Commute Radii
                </button>
                <button
                  onClick={() => toggleMapLayer('populationDensity')}
                  className={`px-2 py-1 rounded-md text-xs ${mapLayers.populationDensity ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  Population
                </button>
                <button
                  onClick={() => toggleMapLayer('laborHeatmap')}
                  className={`px-2 py-1 rounded-md text-xs ${mapLayers.laborHeatmap ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  Labor Pool
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-60px)]">
            <NetworkMap 
              facilities={facilities} 
              selectedFacility={selectedFacility}
              onSelectFacility={handleFacilitySelect}
              layers={mapLayers}
            />
          </CardContent>
        </Card>

        {/* Facility Table Section - 40% width */}
        <Card className="col-span-2 h-[500px] overflow-hidden">
          <CardHeader className="p-3">
            <CardTitle className="text-base">Facility Overview</CardTitle>
            <CardDescription className="text-xs">
              {facilities.length} facilities, {facilities.reduce((sum, f) => sum + f.workers, 0)} workers total
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-80px)]">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs whitespace-nowrap">Facility Name</TableHead>
                  <TableHead className="text-xs text-right">Workers</TableHead>
                  <TableHead className="text-xs text-right">Needed</TableHead>
                  <TableHead className="text-xs text-right">Value</TableHead>
                  <TableHead className="text-xs text-right">Util %</TableHead>
                  <TableHead className="text-xs text-right">Attr %</TableHead>
                  <TableHead className="text-xs text-right">Commute</TableHead>
                  <TableHead className="text-xs text-right">Index</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.map((facility) => (
                  <TableRow 
                    key={facility.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50",
                      selectedFacility?.id === facility.id && "bg-muted"
                    )}
                    onClick={() => handleFacilitySelect(facility)}
                  >
                    <TableCell className="text-xs whitespace-nowrap font-medium">{facility.name}</TableCell>
                    <TableCell className="text-xs text-right">{facility.workers}</TableCell>
                    <TableCell className="text-xs text-right">{facility.neededWorkers}</TableCell>
                    <TableCell className="text-xs text-right">{(facility.marginalValue * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-xs text-right">{(facility.utilisation * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-xs text-right">{(facility.attrition * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-xs text-right">{facility.commuteTime}m</TableCell>
                    <TableCell className="text-xs text-right">{(facility.laborPoolIndex * 100).toFixed(0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Insights & Recommendations</CardTitle>
          <CardDescription className="text-xs">
            AI-generated insights based on current network data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <InsightsPanel selectedFacility={selectedFacility} facilities={facilities} />
        </CardContent>
      </Card>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{facilities.length}</div>
            <p className="text-xs text-muted-foreground">
              {facilities.filter(f => f.utilisation >= 0.9).length} at high utilization
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Workforce</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{facilities.reduce((sum, f) => sum + f.workers, 0)}</div>
            <p className="text-xs text-muted-foreground">
              {facilities.reduce((sum, f) => sum + f.neededWorkers, 0)} additional needed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Avg Commute Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {Math.round(facilities.reduce((sum, f) => sum + f.commuteTime, 0) / facilities.length)} mins
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(facilities.reduce((sum, f) => sum + f.attrition, 0) / facilities.length * 100)}% average attrition rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Network Efficiency</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {Math.round(facilities.reduce((sum, f) => sum + f.marginalValue, 0) / facilities.length * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkDashboard;
