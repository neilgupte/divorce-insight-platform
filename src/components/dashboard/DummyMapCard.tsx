
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toggle, ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map, MapPin, Layers, Filter } from "lucide-react";

interface DummyMapCardProps {
  selectedState: string;
  selectedCity: string;
}

const DummyMapCard: React.FC<DummyMapCardProps> = ({ selectedState, selectedCity }) => {
  const [mapType, setMapType] = useState<string>("standard");
  const [visibleLayers, setVisibleLayers] = useState<string[]>(["wealth", "divorce"]);
  const [zoom, setZoom] = useState<string>("state");

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center"><Map className="mr-2 h-5 w-5" /> Divorce Rate Heatmap</CardTitle>
        <CardDescription>
          Interactive visualization of high-net-worth divorce rates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Tabs defaultValue="standard" onValueChange={(value) => setMapType(value)}>
            <TabsList className="grid w-full max-w-xs grid-cols-2">
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="satellite">Satellite</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <MapPin className="mr-1 h-4 w-4" />
              {selectedState !== "All States" ? selectedState : "USA"}
            </Button>
            <Button size="sm" variant="outline" className="px-2">-</Button>
            <Button size="sm" variant="outline" className="px-2">+</Button>
          </div>
        </div>
        
        {/* Layer Controls */}
        <div className="flex flex-wrap items-center gap-4 border-t border-b py-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="text-sm font-medium">Layers:</span>
          </div>
          
          <ToggleGroup type="multiple" value={visibleLayers} onValueChange={setVisibleLayers}>
            <ToggleGroupItem value="wealth" aria-label="Toggle wealth layer">
              Wealth
            </ToggleGroupItem>
            <ToggleGroupItem value="divorce" aria-label="Toggle divorce layer">
              Divorce
            </ToggleGroupItem>
            <ToggleGroupItem value="assets" aria-label="Toggle assets layer">
              Assets
            </ToggleGroupItem>
          </ToggleGroup>
          
          <div className="ml-auto flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={zoom} onValueChange={setZoom}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="county">County</SelectItem>
                <SelectItem value="city">City</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Dummy Map Display */}
        <div className="relative h-[300px] rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {/* Fake Map UI with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950 dark:to-slate-900">
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
              {Array.from({ length: 25 }).map((_, i) => (
                <div 
                  key={i} 
                  className="border border-blue-200/30 dark:border-blue-800/30"
                  style={{
                    opacity: Math.random() * 0.5 + 0.5
                  }}
                />
              ))}
            </div>
            
            {selectedState !== "All States" && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <MapPin className="h-8 w-8 text-red-500" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-background/80 px-2 py-0.5 rounded text-sm font-medium">
                  {selectedCity !== "All Cities" ? selectedCity : selectedState}
                </div>
              </div>
            )}
          </div>
          
          {/* Map Type Indicator */}
          <div className="absolute bottom-4 right-4 bg-background/80 px-2 py-1 rounded text-xs">
            {mapType === "satellite" ? "Satellite View" : "Standard View"} | Zoom: {zoom}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground text-center italic">
          Note: This is a placeholder map visualization. Real map data integration coming soon.
        </div>
      </CardContent>
    </Card>
  );
};

export default DummyMapCard;
