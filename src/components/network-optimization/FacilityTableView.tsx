
import React from "react";
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
  // ... add more facilities to match the map
];

const FacilityTableView = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Facility Network Overview</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search facilities..." className="pl-8" />
        </div>
      </div>

      <div className="border rounded-lg">
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
            {mockFacilities.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell className="font-medium">{facility.name}</TableCell>
                <TableCell>{facility.type}</TableCell>
                <TableCell>{facility.location}</TableCell>
                <TableCell className="text-right">{facility.capacity}</TableCell>
                <TableCell className="text-right">{(facility.utilization * 100).toFixed(1)}%</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FacilityTableView;
