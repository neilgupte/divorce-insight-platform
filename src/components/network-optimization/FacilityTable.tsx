
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
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

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

interface FacilityTableProps {
  facilities: Facility[];
  selectedFacilityId?: string | null;
  onSelectFacility: (facility: Facility) => void;
}

type SortKey = keyof Omit<Facility, 'lat' | 'lng'>;
type SortDir = 'asc' | 'desc';

const FacilityTable: React.FC<FacilityTableProps> = ({
  facilities,
  selectedFacilityId,
  onSelectFacility
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Handle column header click for sorting
  const handleSortClick = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle direction if same column
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Filter facilities by search term
  const filteredFacilities = facilities.filter(facility => 
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort facilities by current sort key and direction
  const sortedFacilities = [...filteredFacilities].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDir === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      // Number comparison
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
    }
  });

  // Render sort indicator arrow based on current sort state
  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return null;
    
    return sortDir === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1 inline" /> 
      : <ArrowDown className="h-3 w-3 ml-1 inline" />;
  };

  // Format percentage values for display
  const formatPercent = (value: number) => `${(value * 100).toFixed(0)}%`;

  return (
    <div className="h-full flex flex-col">
      {/* Search bar */}
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Facilities table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[180px] cursor-pointer" onClick={() => handleSortClick('name')}>
                Facility {renderSortIndicator('name')}
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSortClick('workers')}>
                Workers {renderSortIndicator('workers')}
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSortClick('neededWorkers')}>
                Needed {renderSortIndicator('neededWorkers')}
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSortClick('utilisation')}>
                Util. {renderSortIndicator('utilisation')}
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSortClick('attrition')}>
                Attr. {renderSortIndicator('attrition')}
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSortClick('commuteTime')}>
                Commute {renderSortIndicator('commuteTime')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFacilities.length > 0 ? (
              sortedFacilities.map((facility) => (
                <TableRow 
                  key={facility.id} 
                  className={`cursor-pointer ${facility.id === selectedFacilityId ? 'bg-muted' : ''}`}
                  onClick={() => onSelectFacility(facility)}
                >
                  <TableCell className="font-medium">
                    <div>{facility.name}</div>
                    <div className="text-xs text-muted-foreground">{facility.type}</div>
                  </TableCell>
                  <TableCell className="text-right">{facility.workers}</TableCell>
                  <TableCell className="text-right">{facility.neededWorkers}</TableCell>
                  <TableCell className="text-right">
                    <span className={
                      facility.utilisation < 0.7 ? 'text-red-500' : 
                      facility.utilisation > 0.9 ? 'text-green-500' : ''
                    }>
                      {formatPercent(facility.utilisation)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={
                      facility.attrition > 0.18 ? 'text-red-500' : 
                      facility.attrition < 0.1 ? 'text-green-500' : ''
                    }>
                      {formatPercent(facility.attrition)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {facility.commuteTime} mins
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No facilities found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-2 border-t text-xs text-muted-foreground">
        Showing {filteredFacilities.length} of {facilities.length} facilities
      </div>
    </div>
  );
};

export default FacilityTable;
