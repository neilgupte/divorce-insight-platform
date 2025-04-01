
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [viewMode, setViewMode] = useState<'opportunity' | 'tam'>('opportunity');
  
  // Generate data when filters change
  useEffect(() => {
    // Generate or fetch ZIP code data
    const data = generateMockZIPData(
      selectedState,
      selectedCity,
      "All", // Use "All" urbanicity by default
      netWorthRange,
      divorceRateThreshold,
      3, // competitor count
      25 // number of ZIP codes to generate
    );
    
    setZipData(data);
  }, [selectedState, selectedCity, netWorthRange, divorceRateThreshold]);
  
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
    <Card className={`transition-all duration-300 ${expanded ? "fixed inset-0 z-50" : "h-full"}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Map className="mr-2 h-5 w-5" />
          <CardTitle>ZIP Code Map</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleExpand}>
          {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className={`${expanded ? "h-[calc(100%-4rem)] p-0" : "h-[400px]"} relative`}>
        {/* Simplified map view without filters */}
        <div className={`w-full ${expanded ? 'h-full' : 'h-[calc(100%-1rem)]'}`}>
          <LeafletMap
            zipData={zipData}
            viewMode={viewMode}
            onZipClick={onZipCodeSelect}
            className={`${expanded ? 'h-full' : 'h-full'} w-full`}
          />
          
          {/* Expand overlay button for non-expanded view */}
          {!expanded && (
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute bottom-4 right-4 z-10"
              onClick={onToggleExpand}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Expand to Full View
            </Button>
          )}
          
          {/* Map Legend */}
          {!expanded && (
            <div className="absolute bottom-16 right-4 bg-card/90 backdrop-blur-sm rounded-md p-2 border z-10">
              <div className="text-xs font-medium mb-2">
                Opportunity Tiers
              </div>
              <div className="flex items-center space-x-2 text-xs mb-1">
                <div className="h-3 w-3 bg-blue-500/50 rounded-sm"></div>
                <span>Low ($0-5M)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs mb-1">
                <div className="h-3 w-3 bg-purple-500/60 rounded-sm"></div>
                <span>Medium ($5-10M)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="h-3 w-3 bg-red-500/70 rounded-sm"></div>
                <span>High ($10M+)</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Expanded view filter and controls */}
        {expanded && (
          <>
            <div className="absolute top-4 left-4 z-10 flex gap-4 bg-background/90 backdrop-blur-sm p-3 rounded-md border">
              <Button 
                variant={viewMode === 'opportunity' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('opportunity')}
              >
                Opportunity View
              </Button>
              <Button 
                variant={viewMode === 'tam' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('tam')}
              >
                TAM View
              </Button>
            </div>
            
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ZIPCodeHeatmap;
