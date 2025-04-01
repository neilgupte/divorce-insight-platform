
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Maximize2, 
  Minimize2, 
  List, 
  ChevronUp, 
  ChevronDown, 
  Printer, 
  Download, 
  Share2
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generateMockZIPData, ZIPCodeData, getStateAbbreviation } from "@/lib/zipUtils";

interface ZIPCodeTableProps {
  selectedState: string;
  selectedCity: string;
  netWorthRange: [number, number];
  divorceRateThreshold: number;
  expanded: boolean;
  onToggleExpand: () => void;
  usStates: string[];
  availableCities: string[];
  onZipCodeSelect: (zipData: ZIPCodeData) => void;
}

const ZIPCodeTable: React.FC<ZIPCodeTableProps> = ({
  selectedState,
  selectedCity,
  netWorthRange,
  divorceRateThreshold,
  expanded,
  onToggleExpand,
  usStates,
  availableCities,
  onZipCodeSelect
}) => {
  const [urbanicity, setUrbanicity] = useState<string>("All");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ZIPCodeData;
    direction: "ascending" | "descending";
  }>({ key: "opportunity", direction: "descending" });
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  
  // Generate simulated ZIP data
  const zipData = generateMockZIPData(selectedState, selectedCity, urbanicity, netWorthRange, divorceRateThreshold, 3);
  
  // Sort data based on current config
  const sortedData = [...zipData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
  
  const requestSort = (key: keyof ZIPCodeData) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof ZIPCodeData) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Function to get opportunity tier badge
  const getOpportunityBadge = (opportunity: number) => {
    if (opportunity >= 10) {
      return {
        variant: "destructive" as const,
        label: "High Opportunity",
        tooltip: "High Opportunity ($10M+)"
      };
    } else if (opportunity >= 5) {
      return {
        variant: "secondary" as const,
        label: "Medium Opportunity",
        tooltip: "Medium Opportunity ($5M-$10M)"
      };
    } else {
      return {
        variant: "default" as const,
        label: "Low Opportunity",
        tooltip: "Low Opportunity (Below $5M)"
      };
    }
  };
  
  return (
    <Card className={`transition-all duration-300 ${expanded ? "fixed inset-4 z-50" : "h-full"}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <List className="mr-2 h-5 w-5" />
          <CardTitle>ZIP Code Table</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleExpand}>
          {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className={`${expanded ? "h-[calc(100%-4rem)] overflow-y-auto" : "h-[400px] overflow-y-auto"}`}>
        <div className="space-y-4">
          {/* Table filters - Removed competitor count filter */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div>
              <Label htmlFor="urbanicity" className="text-xs">Urbanicity</Label>
              <Select value={urbanicity} onValueChange={setUrbanicity}>
                <SelectTrigger id="urbanicity">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Urban">Urban</SelectItem>
                  <SelectItem value="Suburban">Suburban</SelectItem>
                  <SelectItem value="Rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer w-[100px]"
                    onClick={() => requestSort("zipCode")}
                  >
                    <div className="flex items-center">
                      ZIP Code {getSortIcon("zipCode")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer w-[80px]"
                    onClick={() => requestSort("state")}
                  >
                    <div className="flex items-center">
                      State {getSortIcon("state")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => requestSort("city")}
                  >
                    <div className="flex items-center">
                      City {getSortIcon("city")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right w-[90px]"
                    onClick={() => requestSort("tam")}
                  >
                    <div className="flex items-center justify-end">
                      TAM {getSortIcon("tam")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right w-[90px]"
                    onClick={() => requestSort("sam")}
                  >
                    <div className="flex items-center justify-end">
                      SAM {getSortIcon("sam")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right w-[140px]"
                    onClick={() => requestSort("opportunity")}
                  >
                    <div className="flex items-center justify-end">
                      $ Opportunity {getSortIcon("opportunity")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item) => {
                  const opportunityBadge = getOpportunityBadge(item.opportunity);
                  // Generate unique key using more properties to avoid duplicate keys
                  const rowKey = `${item.zipCode}-${item.city}-${item.state}`;
                  
                  return (
                    <TableRow 
                      key={rowKey}
                      className={`cursor-pointer transition-colors ${hoveredRow === item.zipCode ? "bg-muted/90" : "hover:bg-muted/50"}`}
                      onClick={() => onZipCodeSelect(item)}
                      onMouseEnter={() => setHoveredRow(item.zipCode)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <TableCell className="font-medium w-[100px]">{item.zipCode}</TableCell>
                      <TableCell className="w-[80px]">{getStateAbbreviation(item.state)}</TableCell>
                      <TableCell>{item.city}</TableCell>
                      <TableCell className="text-right w-[90px]">
                        <Badge variant="outline">${item.tam}M</Badge>
                      </TableCell>
                      <TableCell className="text-right w-[90px]">
                        <Badge variant="outline">${item.sam}M</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium w-[140px]">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant={opportunityBadge.variant}>
                                ${item.opportunity}M
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{opportunityBadge.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {sortedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Expanded view controls */}
        {expanded && (
          <div className="mt-4 flex items-center space-x-2 justify-end">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ZIPCodeTable;
