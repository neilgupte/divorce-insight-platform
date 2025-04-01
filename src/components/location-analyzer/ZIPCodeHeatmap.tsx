
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map, Maximize2, Printer, Download, Share2, Minimize2 } from "lucide-react";
import { generateMockZIPData, ZIPCodeData } from "@/lib/zipUtils";
import { useToast } from "@/hooks/use-toast";
import LeafletMap from "./LeafletMap";

interface ZIPCodeHeatmapProps {
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

const ZIPCodeHeatmap: React.FC<ZIPCodeHeatmapProps> = ({
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
  const { toast } = useToast();
  const [zipData, setZipData] = useState<ZIPCodeData[]>([]);
  const [urbanicity, setUrbanicity] = useState<string>("All");
  const [viewMode, setViewMode] = useState<'opportunity' | 'tam'>('opportunity');
  const [opportunitySize, setOpportunitySize] = useState<string>("All Sizes");
  
  // Generate data when filters change
  useEffect(() => {
    // Make sure to pass the correct urbanicity filter format
    const urbanicityFilter = urbanicity === "All" ? "All" : urbanicity as "Urban" | "Suburban" | "Rural";
    
    // Generate or fetch ZIP code data
    const data = generateMockZIPData(
      selectedState,
      selectedCity,
      urbanicityFilter,
      netWorthRange,
      divorceRateThreshold,
      3, // competitor count
      25 // number of ZIP codes to generate
    );
    
    // Filter by opportunity size if needed
    let filteredData = [...data];
    if (opportunitySize !== "All Sizes") {
      if (opportunitySize === "Low (<$5M)") {
        filteredData = data.filter(zip => zip.opportunity < 5);
      } else if (opportunitySize === "Medium ($5M–$10M)") {
        filteredData = data.filter(zip => zip.opportunity >= 5 && zip.opportunity < 10);
      } else if (opportunitySize === "High ($10M+)") {
        filteredData = data.filter(zip => zip.opportunity >= 10);
      }
    }
    
    setZipData(filteredData);
  }, [selectedState, selectedCity, urbanicity, netWorthRange, divorceRateThreshold, opportunitySize]);
  
  const handlePrint = () => {
    toast({
      title: "Print Functionality",
      description: "Printing map view...",
    });
    window.print();
  };
  
  const handleDownload = () => {
    toast({
      title: "Download Initiated",
      description: "Map image downloading...",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share Link Created",
      description: "Map link copied to clipboard!",
    });
  };
  
  return (
    <Card className={`transition-all duration-300 ${expanded ? "fixed inset-4 z-50" : "h-full"}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Map className="mr-2 h-5 w-5" />
          <CardTitle>ZIP Code Map</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleExpand}>
          {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className={`${expanded ? "h-[calc(100%-4rem)]" : "h-[400px]"} p-4`}>
        {/* Only show filters in non-expanded view */}
        {!expanded && (
          <div className="flex flex-wrap gap-3 mb-4">
            <div>
              <Select value={opportunitySize} onValueChange={setOpportunitySize}>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Opportunity Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Sizes">All Sizes</SelectItem>
                  <SelectItem value="Low (<$5M)">Low (&lt;$5M)</SelectItem>
                  <SelectItem value="Medium ($5M–$10M)">Medium ($5M–$10M)</SelectItem>
                  <SelectItem value="High ($10M+)">High ($10M+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={urbanicity} onValueChange={setUrbanicity}>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Urbanicity" />
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
              <Select value={viewMode} onValueChange={(value: 'opportunity' | 'tam') => setViewMode(value)}>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="View Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opportunity">Opportunity</SelectItem>
                  <SelectItem value="tam">TAM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {/* Map Container - Now Full Width */}
        <div className={`${expanded ? 'h-full' : 'h-[calc(100%-3rem)]'}`}>
          <LeafletMap
            zipData={zipData}
            viewMode={viewMode}
            onZipClick={onZipCodeSelect}
            className="rounded-md"
          />
          
          {/* Map Legend - only show in non-expanded view */}
          {!expanded && (
            <div className="absolute bottom-8 right-8 bg-card/90 backdrop-blur-sm rounded-md p-2 border z-10">
              <div className="text-xs font-medium mb-2">
                {viewMode === 'opportunity' ? 'Opportunity Tiers' : 'TAM Values'}
              </div>
              <div className="flex items-center space-x-2 text-xs mb-1">
                <div className="h-3 w-3 bg-blue-500/50 rounded-sm"></div>
                <span>Low {viewMode === 'opportunity' ? '($0-5M)' : '($0-10M)'}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs mb-1">
                <div className="h-3 w-3 bg-purple-500/60 rounded-sm"></div>
                <span>Medium {viewMode === 'opportunity' ? '($5-10M)' : '($10-20M)'}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="h-3 w-3 bg-red-500/70 rounded-sm"></div>
                <span>High {viewMode === 'opportunity' ? '($10M+)' : '($20M+)'}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Expanded view controls - only in expanded view */}
        {expanded && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ZIPCodeHeatmap;
