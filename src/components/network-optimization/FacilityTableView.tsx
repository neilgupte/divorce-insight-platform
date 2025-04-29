
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FacilityTable from "./FacilityTable";
import { MapPin } from "lucide-react";

// Mock facilities data for demonstration
const mockFacilities = [
  { id:"1", name:"Downtown Distribution Center", type:"Distribution", workers:145, neededWorkers:15, utilisation:0.91, attrition:0.12, commuteTime:28, laborPoolIndex: 0.85, marginalValue: 84500, lat:37.7749, lng:-122.4194 },
  { id:"2", name:"Eastside Fulfillment",         type:"Fulfillment",  workers:78,  neededWorkers:23, utilisation:0.77, attrition:0.18, commuteTime:35, laborPoolIndex: 0.73, marginalValue: 65200, lat:37.8044, lng:-122.2712 },
  { id:"3", name:"South Bay Storage",            type:"Storage",      workers:92,  neededWorkers:8,  utilisation:0.89, attrition:0.08, commuteTime:22, laborPoolIndex: 0.92, marginalValue: 78400, lat:37.3382, lng:-121.8863 },
  { id:"4", name:"North County Logistics",       type:"Logistics",    workers:112, neededWorkers:0,  utilisation:1.00, attrition:0.15, commuteTime:31, laborPoolIndex: 0.88, marginalValue: 95600, lat:38.1499, lng:-122.4569 },
  { id:"5", name:"Central Valley Distribution",  type:"Distribution", workers:65,  neededWorkers:30, utilisation:0.68, attrition:0.22, commuteTime:42, laborPoolIndex: 0.67, marginalValue: 52400, lat:37.9577, lng:-121.2908 },
  { id:"6", name:"South Industrial Park",        type:"Logistics",    workers:87,  neededWorkers:12, utilisation:0.84, attrition:0.16, commuteTime:29, laborPoolIndex: 0.79, marginalValue: 68700, lat:37.5485, lng:-122.0585 },
  { id:"7", name:"Western Warehouse Complex",    type:"Storage",      workers:104, neededWorkers:5,  utilisation:0.92, attrition:0.10, commuteTime:25, laborPoolIndex: 0.86, marginalValue: 89300, lat:37.4834, lng:-122.2325 },
  { id:"8", name:"Northern Supply Chain Center", type:"Fulfillment",  workers:72,  neededWorkers:18, utilisation:0.75, attrition:0.19, commuteTime:38, laborPoolIndex: 0.71, marginalValue: 61200, lat:38.0158, lng:-122.1359 },
];

const FacilityTableView: React.FC = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>();
  
  const handleSelectFacility = (facility: any) => {
    setSelectedFacilityId(facility.id);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Facility Network Table</h1>
          <p className="text-muted-foreground">Comprehensive view of all network facilities</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/network/dashboard">
            <MapPin className="mr-2 h-4 w-4" />
            View Map
          </Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Facilities Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <FacilityTable 
            facilities={mockFacilities}
            selectedFacilityId={selectedFacilityId}
            onSelectFacility={handleSelectFacility}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityTableView;
