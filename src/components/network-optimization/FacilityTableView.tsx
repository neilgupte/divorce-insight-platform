
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacilityTable from "./FacilityTable";

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

const FacilityTableView = () => {
  const [facilities] = useState<Facility[]>(mockFacilities);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const navigate = useNavigate();

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
  };

  const goBack = () => {
    navigate('/network/dashboard');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facilities Table</h1>
          <p className="text-muted-foreground">
            View and manage your network facilities
          </p>
        </div>
        <Button onClick={goBack} className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Return to Map View
        </Button>
      </div>

      <Card className="h-[calc(100vh-240px)] overflow-hidden">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-lg">All Facilities</CardTitle>
          <CardDescription className="text-xs">
            {facilities.length} facilities, {facilities.reduce((sum, f) => sum + f.workers, 0)} workers total
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-2 h-[calc(100%-90px)]">
          <FacilityTable
            facilities={facilities}
            selectedFacilityId={selectedFacility?.id}
            onSelectFacility={handleFacilitySelect}
          />
        </CardContent>
      </Card>

      {selectedFacility && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Facility: {selectedFacility.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium">Workers</p>
                <p className="text-2xl">{selectedFacility.workers}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Needed</p>
                <p className="text-2xl">{selectedFacility.neededWorkers}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Utilization</p>
                <p className={`text-2xl ${
                  selectedFacility.utilisation < 0.7 ? 'text-red-500' : 
                  selectedFacility.utilisation > 0.9 ? 'text-green-500' : ''
                }`}>
                  {Math.round(selectedFacility.utilisation * 100)}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Attrition</p>
                <p className={`text-2xl ${
                  selectedFacility.attrition > 0.18 ? 'text-red-500' : 
                  selectedFacility.attrition < 0.1 ? 'text-green-500' : ''
                }`}>
                  {Math.round(selectedFacility.attrition * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FacilityTableView;
