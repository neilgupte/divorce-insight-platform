
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Maximize2, Printer, Download, Share2, Minimize2 } from "lucide-react";
import { generateMockZIPData } from "@/lib/zipUtils";

interface ZIPCodeHeatmapProps {
  selectedState: string;
  selectedCity: string;
  netWorthRange: [number, number];
  divorceRateThreshold: number;
  expanded: boolean;
  onToggleExpand: () => void;
}

const ZIPCodeHeatmap: React.FC<ZIPCodeHeatmapProps> = ({
  selectedState,
  selectedCity,
  netWorthRange,
  divorceRateThreshold,
  expanded,
  onToggleExpand
}) => {
  // This would typically call an API or use a mapping library
  // For demo purposes, we're just rendering a simulated heatmap
  
  return (
    <Card className={`transition-all duration-300 ${expanded ? "fixed inset-4 z-50" : "h-full"}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Map className="mr-2 h-5 w-5" />
          <CardTitle>ZIP Code Heatmap</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleExpand}>
          {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className={`${expanded ? "h-[calc(100%-4rem)]" : "h-[400px]"}`}>
        <div className="relative h-full rounded-md border bg-muted/20">
          {/* Simulated heatmap visualization */}
          <div className="absolute inset-0 p-4">
            <div className="h-full w-full bg-gradient-to-br from-blue-500/10 via-purple-500/20 to-red-500/30 rounded-md flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Simulated ZIP Code Heatmap</p>
                <p className="text-sm text-muted-foreground">
                  Filters: {selectedState !== "All States" ? selectedState : "All"} / 
                  {selectedCity !== "All Cities" ? selectedCity : "All"} / 
                  ${netWorthRange[0]}M-${netWorthRange[1]}M / 
                  {divorceRateThreshold}%+ DR
                </p>
                <div className="grid grid-cols-5 gap-1 mt-6 max-w-md mx-auto">
                  {Array.from({ length: 25 }).map((_, i) => {
                    const intensity = Math.random();
                    const color = intensity > 0.7 ? "bg-red-500/70" : 
                                 intensity > 0.4 ? "bg-purple-500/60" : "bg-blue-500/50";
                    const zipCode = Math.floor(10000 + Math.random() * 90000);
                    const tam = (Math.random() * 15 + 2).toFixed(1);
                    
                    return (
                      <div 
                        key={i}
                        className={`${color} h-12 w-full rounded-sm flex items-center justify-center cursor-help transition-colors hover:brightness-110`}
                        title={`ZIP: ${zipCode} - $${tam}M TAM`}
                      >
                        <span className="text-xs font-medium text-white">{zipCode}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm rounded-md p-2 border">
              <div className="flex items-center space-x-2 text-xs mb-1">
                <div className="h-3 w-3 bg-blue-500/50 rounded-sm"></div>
                <span>Low Opportunity ($0-5M)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs mb-1">
                <div className="h-3 w-3 bg-purple-500/60 rounded-sm"></div>
                <span>Medium Opportunity ($5-10M)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="h-3 w-3 bg-red-500/70 rounded-sm"></div>
                <span>High Opportunity ($10M+)</span>
              </div>
            </div>
          </div>
          
          {/* Expanded view controls */}
          {expanded && (
            <div className="absolute top-4 right-4 flex items-center space-x-2">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ZIPCodeHeatmap;
