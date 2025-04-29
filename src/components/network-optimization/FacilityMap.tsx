
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NetworkMap from "./NetworkMap";

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

const FacilityMap = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [mapLayers, setMapLayers] = useState({
    facilities: true,
    commuteRadii: true,
    populationDensity: true,
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facility Map</h1>
        <p className="text-muted-foreground">
          Interactive geospatial view of all network facilities
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => toggleMapLayer('facilities')}
          className={`px-3 py-1.5 rounded-md text-sm ${mapLayers.facilities ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          Facilities
        </button>
        <button
          onClick={() => toggleMapLayer('commuteRadii')}
          className={`px-3 py-1.5 rounded-md text-sm ${mapLayers.commuteRadii ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          Commute Radii
        </button>
        <button
          onClick={() => toggleMapLayer('populationDensity')}
          className={`px-3 py-1.5 rounded-md text-sm ${mapLayers.populationDensity ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          Population
        </button>
        <button
          onClick={() => toggleMapLayer('laborHeatmap')}
          className={`px-3 py-1.5 rounded-md text-sm ${mapLayers.laborHeatmap ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          Labor Pool
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 h-[600px] overflow-hidden">
          <CardContent className="p-0 h-full">
            <NetworkMap 
              facilities={mockFacilities} 
              selectedFacility={selectedFacility}
              onSelectFacility={handleFacilitySelect}
              layers={mapLayers}
            />
          </CardContent>
        </Card>

        <Card className="h-[600px] overflow-auto">
          <CardHeader>
            <CardTitle>Facility Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFacility ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedFacility.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedFacility.type}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">
                    <div className="font-medium">Workers</div>
                    <div>{selectedFacility.workers}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Needed</div>
                    <div>{selectedFacility.neededWorkers}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Utilisation</div>
                    <div>{(selectedFacility.utilisation * 100).toFixed(0)}%</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Attrition</div>
                    <div>{(selectedFacility.attrition * 100).toFixed(0)}%</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Commute Time</div>
                    <div>{selectedFacility.commuteTime} mins</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Labor Pool</div>
                    <div>{selectedFacility.laborPoolIndex.toFixed(2)}</div>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Quick Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedFacility.neededWorkers > 0 
                      ? `This facility needs ${selectedFacility.neededWorkers} additional workers. The local labor pool index of ${selectedFacility.laborPoolIndex.toFixed(2)} indicates ${selectedFacility.laborPoolIndex > 0.7 ? "favorable" : "challenging"} hiring conditions.` 
                      : `This facility is fully staffed. Focus on retention strategies to maintain optimal workforce levels.`
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-center p-4">
                <p>Select a facility on the map to view its details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacilityMap;
