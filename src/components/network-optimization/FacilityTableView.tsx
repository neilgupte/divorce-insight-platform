
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  utilization: number;
  status: "Active" | "Inactive" | "Maintenance";
}

const mockFacilities: Facility[] = [
  { id: "1", name: "SF Downtown Hub", type: "Distribution", location: "San Francisco, CA", capacity: 1000, utilization: 0.85, status: "Active" },
  { id: "2", name: "Oakland Central", type: "Logistics", location: "Oakland, CA", capacity: 800, utilization: 0.92, status: "Active" },
  { id: "3", name: "San Jose Main", type: "Distribution", location: "San Jose, CA", capacity: 1200, utilization: 0.78, status: "Active" },
  { id: "4", name: "Eastside Fulfillment", type: "Fulfillment", location: "Emeryville, CA", capacity: 750, utilization: 0.77, status: "Active" },
  { id: "5", name: "South Bay Storage", type: "Storage", location: "Cupertino, CA", capacity: 900, utilization: 0.89, status: "Active" },
  { id: "6", name: "North County Logistics", type: "Logistics", location: "San Rafael, CA", capacity: 650, utilization: 1.00, status: "Active" },
  { id: "7", name: "Central Valley Distribution", type: "Distribution", location: "Stockton, CA", capacity: 1100, utilization: 0.68, status: "Maintenance" },
  { id: "8", name: "Palo Alto Center", type: "Fulfillment", location: "Palo Alto, CA", capacity: 500, utilization: 0.75, status: "Active" },
  { id: "9", name: "Mountain View Hub", type: "Storage", location: "Mountain View, CA", capacity: 600, utilization: 0.61, status: "Active" },
  { id: "10", name: "Berkeley Facility", type: "Distribution", location: "Berkeley, CA", capacity: 700, utilization: 0.79, status: "Active" },
  { id: "11", name: "Richmond Point", type: "Logistics", location: "Richmond, CA", capacity: 850, utilization: 0.83, status: "Active" },
  { id: "12", name: "Fremont Center", type: "Storage", location: "Fremont, CA", capacity: 950, utilization: 0.90, status: "Active" },
  { id: "13", name: "Hayward Hub", type: "Distribution", location: "Hayward, CA", capacity: 720, utilization: 0.95, status: "Active" },
  { id: "14", name: "San Mateo Facility", type: "Fulfillment", location: "San Mateo, CA", capacity: 540, utilization: 0.72, status: "Active" },
  { id: "15", name: "Redwood City Center", type: "Storage", location: "Redwood City, CA", capacity: 680, utilization: 0.88, status: "Active" },
  { id: "16", name: "Daly City Hub", type: "Distribution", location: "Daly City, CA", capacity: 570, utilization: 0.67, status: "Maintenance" },
  { id: "17", name: "South SF Point", type: "Logistics", location: "South San Francisco, CA", capacity: 490, utilization: 0.71, status: "Active" },
  { id: "18", name: "Alameda Facility", type: "Storage", location: "Alameda, CA", capacity: 620, utilization: 0.87, status: "Active" },
  { id: "19", name: "San Rafael Center", type: "Distribution", location: "San Rafael, CA", capacity: 780, utilization: 0.76, status: "Active" },
  { id: "20", name: "Novato Logistics", type: "Logistics", location: "Novato, CA", capacity: 550, utilization: 0.63, status: "Inactive" },
];

const FacilityTableView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter facilities based on search term
  const filteredFacilities = mockFacilities.filter(facility => 
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Facility Network Overview</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search facilities..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">All Facilities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Facility Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
                  <TableHead className="text-right">Utilization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacilities.length > 0 ? (
                  filteredFacilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell>{facility.type}</TableCell>
                      <TableCell>{facility.location}</TableCell>
                      <TableCell className="text-right">{facility.capacity.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={`${
                          facility.utilization > 0.9 ? 'text-green-600' :
                          facility.utilization < 0.7 ? 'text-orange-500' : ''
                        }`}>
                          {(facility.utilization * 100).toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          facility.status === 'Active' ? 'bg-green-100 text-green-800' :
                          facility.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {facility.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No facilities found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        Showing {filteredFacilities.length} of {mockFacilities.length} facilities
      </div>
    </div>
  );
};

export default FacilityTableView;
