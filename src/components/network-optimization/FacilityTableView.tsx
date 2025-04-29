
import React from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const FacilityTableView = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Facilities Management</h1>
      <p className="mt-2 text-muted-foreground">
        View and manage all facilities in your network
      </p>
      
      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facility Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Main Distribution Center</TableCell>
              <TableCell>Chicago, IL</TableCell>
              <TableCell>Distribution Center</TableCell>
              <TableCell>250,000 sq ft</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>West Hub</TableCell>
              <TableCell>Phoenix, AZ</TableCell>
              <TableCell>Regional Hub</TableCell>
              <TableCell>120,000 sq ft</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>East Coast Facility</TableCell>
              <TableCell>Atlanta, GA</TableCell>
              <TableCell>Distribution Center</TableCell>
              <TableCell>180,000 sq ft</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FacilityTableView;
