
// src/components/network-optimization/NetworkDashboard.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  MapPin,
  Building,
  Table as TableIcon,
  Maximize,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import NetworkMap from "./NetworkMap";
import FacilityTable from "./FacilityTable";
import InsightsPanel from "./InsightsPanel";

// —————— types ——————
export interface Facility {
  id: string;
  name: string;
  workers: number;
  neededWorkers: number;
  marginalValue: number;
  utilisation: number; // 0–1
  attrition: number;   // 0–1
  commuteTime: number; // mins
  laborPoolIndex: number;
  type: string;
  lat: number;
  lng: number;
}

// —————— mock data ——————
const mockFacilities: Facility[] = [
  { 
    id: "1", 
    name: "Downtown Distribution Center", 
    type: "Distribution", 
    workers: 145, 
    neededWorkers: 15, 
    utilisation: 0.91, 
    attrition: 0.12, 
    commuteTime: 28, 
    laborPoolIndex: 0.76, 
    marginalValue: 0.87,
    lat: 37.7749, 
    lng: -122.4194 
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
    laborPoolIndex: 0.62, 
    marginalValue: 0.65,
    lat: 37.8044, 
    lng: -122.2712 
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
    laborPoolIndex: 0.88, 
    marginalValue: 0.92,
    lat: 37.3382, 
    lng: -121.8863 
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
    laborPoolIndex: 0.71, 
    marginalValue: 0.79,
    lat: 38.1499, 
    lng: -122.4569 
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
    laborPoolIndex: 0.55, 
    marginalValue: 0.58,
    lat: 37.9577, 
    lng: -121.2908 
  }
];

const NetworkDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"map" | "table">("map");
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [insightType, setInsightType] = useState<"network" | "facility" | "scenario">("network");

  const [maxRadius, setMaxRadius] = useState<number>(30);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedFacility = useMemo(() => {
    return mockFacilities.find(f => f.id === selectedFacilityId) || null;
  }, [selectedFacilityId]);

  const handleSelectFacility = (facility: Facility) => {
    setSelectedFacilityId(facility.id);
    // Auto-switch insight panel to facility view when selecting
    setInsightType("facility");
  };

  const handleSelectFacilityId = (id: string) => {
    setSelectedFacilityId(id);
    setInsightType("facility");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and optimize your logistics network
          </p>
        </div>

        {/* View toggle buttons */}
        <div className="flex space-x-2">
          <Button
            variant={activeView === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("map")}
          >
            <MapPin className="mr-1 h-4 w-4" />
            Map View
          </Button>
          <Button
            variant={activeView === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("table")}
          >
            <TableIcon className="mr-1 h-4 w-4" />
            Table View
          </Button>
          {activeView === "map" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Maximize className="mr-1 h-4 w-4" />
                  Fullscreen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Network Map</DialogTitle>
                  <DialogClose />
                </DialogHeader>
                <div className="h-full">
                  <NetworkMap
                    facilities={mockFacilities}
                    selectedFacility={selectedFacility}
                    onSelectFacility={handleSelectFacility}
                    layers={{ 
                      facilities: true,
                      commuteRadii: true,
                      populationDensity: true,
                      laborHeatmap: true
                    }}
                    fullscreen={true}
                    maxRadius={maxRadius}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Dashboard insight tabs */}
      <div className="flex space-x-1 border-b">
        <Button
          variant={insightType === "network" ? "default" : "ghost"}
          size="sm"
          onClick={() => setInsightType("network")}
          className="rounded-none rounded-t-lg"
        >
          Network Insights
        </Button>
        <Button
          variant={insightType === "facility" ? "default" : "ghost"}
          size="sm"
          onClick={() => setInsightType("facility")}
          className="rounded-none rounded-t-lg"
          disabled={!selectedFacility}
        >
          Facility Details
        </Button>
        <Button
          variant={insightType === "scenario" ? "default" : "ghost"}
          size="sm"
          onClick={() => setInsightType("scenario")}
          className="rounded-none rounded-t-lg"
        >
          Scenario Modeler
        </Button>
      </div>

      {/* Main content area */}
      {activeView === "map" ? (
        // Map view
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map card */}
          <div className="lg:col-span-2 bg-card rounded-lg border h-[600px] overflow-hidden">
            <NetworkMap
              facilities={mockFacilities}
              selectedFacility={selectedFacility}
              onSelectFacility={handleSelectFacility}
              layers={{ 
                facilities: true,
                commuteRadii: true,
                populationDensity: true,
                laborHeatmap: true
              }}
              maxRadius={maxRadius}
            />
          </div>

          {/* Insights panel */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">
              {insightType === "network"
                ? "Network Insights"
                : insightType === "facility"
                ? "Facility Details"
                : "Scenario Modeler"}
            </h3>

            <InsightsPanel
              selectedFacility={selectedFacility}
              facilities={mockFacilities}
              initialInsightType={insightType}
            />
          </div>
        </div>
      ) : (
        // Table view
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table card */}
          <div className="lg:col-span-2 bg-card rounded-lg border h-[600px] overflow-hidden">
            <FacilityTable
              facilities={mockFacilities}
              selectedFacilityId={selectedFacilityId}
              onSelectFacility={handleSelectFacility}
            />
          </div>

          {/* Insights panel */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">
              {insightType === "network"
                ? "Network Insights"
                : insightType === "facility"
                ? "Facility Details"
                : "Scenario Modeler"}
            </h3>

            <InsightsPanel
              selectedFacility={selectedFacility}
              facilities={mockFacilities}
              initialInsightType={insightType}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkDashboard;
