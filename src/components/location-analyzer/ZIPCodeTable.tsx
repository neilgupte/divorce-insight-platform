
import React, { useState, useMemo } from "react";
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

// Type for sorting options
type SortOption = {
  label: string;
  key: keyof ZIPCodeData | "divorceRate";
  direction: "ascending" | "descending";
};

// Type for opportunity size filter
type OpportunitySize = "All" | "High" | "Medium" | "Low";

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
  const [opportunitySize, setOpportunitySize] = useState<OpportunitySize>("All");
  const [sortOption, setSortOption] = useState<string>("opportunity-desc");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  
  // Sort options for the dropdown
  const sortOptions: Record<string, SortOption> = {
    "opportunity-desc": { label: "Opportunity (High → Low)", key: "opportunity", direction: "descending" },
    "opportunity-asc": { label: "Opportunity (Low → High)", key: "opportunity", direction: "ascending" },
    "tam-desc": { label: "TAM", key: "tam", direction: "descending" },
    "sam-desc": { label: "SAM", key: "sam", direction: "descending" },
    "city-asc": { label: "City (A-Z)", key: "city", direction: "ascending" },
    "divorceRate-desc": { label: "Divorce Rate (High → Low)", key: "divorceRate", direction: "descending" },
  };
  
  // Current sort configuration
  const sortConfig = sortOptions[sortOption];
  
  // Generate simulated ZIP data with a variety of opportunity levels
  const zipData = useMemo(() => {
    const baseData = generateMockZIPData(selectedState, selectedCity, urbanicity, netWorthRange, divorceRateThreshold, 3, 15);
    
    // Ensure data includes at least 2 high tier, 3 medium tier items
    const highTierCount = baseData.filter(item => item.opportunity >= 10).length;
    const mediumTierCount = baseData.filter(item => item.opportunity >= 5 && item.opportunity < 10).length;
    
    if (highTierCount < 2 || mediumTierCount < 3) {
      const enhancedData = [...baseData];
      
      // Add high tier items if needed
      if (highTierCount < 2) {
        for (let i = 0; i < 2 - highTierCount; i++) {
          const existingItem = enhancedData[i];
          if (existingItem) {
            enhancedData[i] = {
              ...existingItem,
              opportunity: 10 + Math.floor(Math.random() * 5), // 10-15M
              tam: 20 + Math.floor(Math.random() * 10),
              sam: 15 + Math.floor(Math.random() * 5)
            };
          }
        }
      }
      
      // Add medium tier items if needed
      if (mediumTierCount < 3) {
        for (let i = 0; i < 3 - mediumTierCount; i++) {
          const existingItem = enhancedData[2 + i];
          if (existingItem) {
            enhancedData[2 + i] = {
              ...existingItem,
              opportunity: 5 + Math.floor(Math.random() * 4) + Math.random(), // 5-9.9M
              tam: 10 + Math.floor(Math.random() * 10),
              sam: 8 + Math.floor(Math.random() * 5)
            };
          }
        }
      }
      
      return enhancedData;
    }
    
    // Ensure data includes divorce rates (updated to always provide a divorce rate)
    return baseData.map(item => ({
      ...item,
      divorceRate: item.divorceRate !== undefined ? item.divorceRate : (3 + Math.random() * 7) // 3-10% range if not already present
    }));
  }, [selectedState, selectedCity, urbanicity, netWorthRange, divorceRateThreshold]);
  
  // Filter data based on opportunity size
  const filteredData = useMemo(() => {
    if (opportunitySize === "All") return zipData;
    
    return zipData.filter(item => {
      switch (opportunitySize) {
        case "High":
          return item.opportunity >= 10;
        case "Medium":
          return item.opportunity >= 5 && item.opportunity < 10;
        case "Low":
          return item.opportunity < 5;
        default:
          return true;
      }
    });
  }, [zipData, opportunitySize]);
  
  // Sort data based on current config
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      // Handle divorce rate sorting specially since it's not directly a key of ZIPCodeData
      if (sortConfig.key === "divorceRate") {
        const aValue = a.divorceRate || 0;
        const bValue = b.divorceRate || 0;
        return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue;
      }
      
      // Handle other keys
      if (a[sortConfig.key as keyof ZIPCodeData] < b[sortConfig.key as keyof ZIPCodeData]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key as keyof ZIPCodeData] > b[sortConfig.key as keyof ZIPCodeData]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);
  
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
          {/* Table filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
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
            
            <div>
              <Label htmlFor="opportunity-size" className="text-xs">Opportunity Size</Label>
              <Select value={opportunitySize} onValueChange={(value) => setOpportunitySize(value as OpportunitySize)}>
                <SelectTrigger id="opportunity-size">
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Sizes</SelectItem>
                  <SelectItem value="High">High ($10M+)</SelectItem>
                  <SelectItem value="Medium">Medium ($5M-$10M)</SelectItem>
                  <SelectItem value="Low">Low (&lt;$5M)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sort-by" className="text-xs">Sort By</Label>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Opportunity (High → Low)" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(sortOptions).map(([key, option]) => (
                    <SelectItem key={key} value={key}>{option.label}</SelectItem>
                  ))}
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
                    className="cursor-pointer w-[80px]"
                    onClick={() => setSortOption("zipCode")}
                  >
                    <div className="flex items-center">
                      ZIP Code
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer w-[60px]"
                    onClick={() => setSortOption("city-asc")}
                  >
                    <div className="flex items-center">
                      City
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer w-[50px]"
                  >
                    <div className="flex items-center">
                      State
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right w-[70px]"
                    onClick={() => setSortOption("divorceRate-desc")}
                  >
                    <div className="flex items-center justify-end">
                      Divorce Rate
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right w-[60px]"
                    onClick={() => setSortOption("tam-desc")}
                  >
                    <div className="flex items-center justify-end">
                      TAM
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right w-[60px]"
                    onClick={() => setSortOption("sam-desc")}
                  >
                    <div className="flex items-center justify-end">
                      SAM
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right w-[90px]"
                    onClick={() => setSortOption(sortOption === "opportunity-desc" ? "opportunity-asc" : "opportunity-desc")}
                  >
                    <div className="flex items-center justify-end">
                      $ Opportunity {sortOption.startsWith("opportunity") && (sortOption.endsWith("desc") ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />)}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item) => {
                  const opportunityBadge = getOpportunityBadge(item.opportunity);
                  // Generate unique key using multiple properties
                  const rowKey = `${item.zipCode}-${item.city}-${item.state}-${item.opportunity.toFixed(1)}`;
                  
                  return (
                    <TableRow 
                      key={rowKey}
                      className={`cursor-pointer transition-colors ${hoveredRow === item.zipCode ? "bg-muted/90" : "hover:bg-muted/50"}`}
                      onClick={() => onZipCodeSelect(item)}
                      onMouseEnter={() => setHoveredRow(item.zipCode)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <TableCell className="font-medium w-[80px]">{item.zipCode}</TableCell>
                      <TableCell className="w-[60px]">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{item.city.substring(0, 3).toUpperCase()}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.city}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="w-[50px]">
                        {getStateAbbreviation(item.state)}
                      </TableCell>
                      <TableCell className="text-right w-[70px]">
                        <Badge variant="outline">{item.divorceRate?.toFixed(1)}%</Badge>
                      </TableCell>
                      <TableCell className="text-right w-[60px]">
                        <Badge variant="outline">${item.tam}M</Badge>
                      </TableCell>
                      <TableCell className="text-right w-[60px]">
                        <Badge variant="outline">${item.sam}M</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium w-[90px]">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant={opportunityBadge.variant}>
                                ${item.opportunity.toFixed(1)}M
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
                    <TableCell colSpan={7} className="h-24 text-center">
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
