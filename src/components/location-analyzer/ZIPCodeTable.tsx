
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
  Share2,
  Check,
  X
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { generateMockZIPData, ZIPCodeData } from "@/lib/zipUtils";

interface ZIPCodeTableProps {
  selectedState: string;
  selectedCity: string;
  netWorthRange: [number, number];
  divorceRateThreshold: number;
  expanded: boolean;
  onToggleExpand: () => void;
  usStates: string[];
  availableCities: string[];
}

const ZIPCodeTable: React.FC<ZIPCodeTableProps> = ({
  selectedState,
  selectedCity,
  netWorthRange,
  divorceRateThreshold,
  expanded,
  onToggleExpand,
  usStates,
  availableCities
}) => {
  const [urbanicity, setUrbanicity] = useState<string>("All");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ZIPCodeData;
    direction: "ascending" | "descending";
  }>({ key: "opportunity", direction: "descending" });
  const [competitors, setCompetitors] = useState<number>(3);
  
  // Generate simulated ZIP data
  const zipData = generateMockZIPData(selectedState, selectedCity, urbanicity, netWorthRange, divorceRateThreshold, competitors);
  
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
            
            <div>
              <Label htmlFor="competitor-count" className="text-xs">Competitor Count: {competitors}</Label>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCompetitors(Math.max(0, competitors - 1))}
                >
                  <span>-</span>
                </Button>
                <Input 
                  id="competitor-count"
                  type="number"
                  min="0"
                  value={competitors}
                  onChange={(e) => setCompetitors(Math.max(0, parseInt(e.target.value) || 0))}
                  className="text-center h-8"
                />
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCompetitors(competitors + 1)}
                >
                  <span>+</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => requestSort("zipCode")}
                  >
                    <div className="flex items-center">
                      ZIP Code {getSortIcon("zipCode")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
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
                    className="cursor-pointer text-right"
                    onClick={() => requestSort("tam")}
                  >
                    <div className="flex items-center justify-end">
                      TAM {getSortIcon("tam")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => requestSort("sam")}
                  >
                    <div className="flex items-center justify-end">
                      SAM {getSortIcon("sam")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => requestSort("competitorCount")}
                  >
                    <div className="flex items-center justify-end">
                      Competitors {getSortIcon("competitorCount")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => requestSort("opportunity")}
                  >
                    <div className="flex items-center justify-end">
                      $ Opportunity {getSortIcon("opportunity")}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Has Office?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item) => (
                  <TableRow key={item.zipCode}>
                    <TableCell className="font-medium">{item.zipCode}</TableCell>
                    <TableCell>{item.state}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">${item.tam}M</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">${item.sam}M</Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.competitorCount}</TableCell>
                    <TableCell className="text-right font-medium">
                      <Badge variant={item.opportunity > 8 ? "default" : item.opportunity > 4 ? "secondary" : "outline"}>
                        ${item.opportunity}M
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={item.hasOffice}
                        onCheckedChange={(checked) => {
                          // In a real app, you'd update the data here
                          console.log(`Office for ${item.zipCode} set to ${checked}`);
                        }} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {sortedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
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
