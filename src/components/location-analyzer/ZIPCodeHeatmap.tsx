
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Map } from "lucide-react";
import { generateMockZIPData, ZIPCodeData } from "@/lib/zipUtils";
import { useToast } from "@/hooks/use-toast";

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
  
  // Count ZIP codes by opportunity tier
  const opportunityCounts = {
    high: zipData.filter(zip => zip.opportunity >= 10).length,
    medium: zipData.filter(zip => zip.opportunity >= 5 && zip.opportunity < 10).length,
    low: zipData.filter(zip => zip.opportunity < 5).length
  };
  
  return (
    <Card className={`transition-all duration-300 h-full ${expanded ? "fixed inset-0 z-50" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center">
            <Map className="mr-2 h-5 w-5" />
            ZIP Opportunity Map
          </CardTitle>
          <CardDescription>
            Explore high-opportunity ZIPs across the U.S.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* USA Map Illustration or Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-muted">
            <Map className="h-12 w-12 text-primary opacity-70" />
          </div>
        </div>
        
        {/* Opportunity Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 rounded-md bg-red-500/10 border border-red-500/20">
            <span className="text-lg font-bold">{opportunityCounts.high}</span>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-md bg-purple-500/10 border border-purple-500/20">
            <span className="text-lg font-bold">{opportunityCounts.medium}</span>
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
            <span className="text-lg font-bold">{opportunityCounts.low}</span>
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
        </div>
        
        {/* Opportunity Tiers Legend */}
        <div className="bg-card/90 backdrop-blur-sm rounded-md p-3 border">
          <div className="text-xs font-medium mb-2">
            Opportunity Tiers
          </div>
          <div className="flex items-center space-x-2 text-xs mb-1">
            <div className="h-3 w-3 bg-red-500/70 rounded-sm"></div>
            <span>High ($10M+)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs mb-1">
            <div className="h-3 w-3 bg-purple-500/60 rounded-sm"></div>
            <span>Medium ($5-10M)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="h-3 w-3 bg-blue-500/50 rounded-sm"></div>
            <span>Low ($0-5M)</span>
          </div>
        </div>
        
        {/* Total Opportunity Value */}
        <div className="bg-muted p-3 rounded-md text-center">
          <div className="text-sm font-medium mb-1">Total Opportunity Value</div>
          <div className="text-xl font-bold">${zipData.reduce((sum, zip) => sum + zip.opportunity, 0).toFixed(1)}M</div>
        </div>
        
        {/* View Full Map Button */}
        <Button 
          className="w-full" 
          onClick={onToggleExpand}
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          View Full Map
        </Button>
      </CardContent>
    </Card>
  );
};

export default ZIPCodeHeatmap;
