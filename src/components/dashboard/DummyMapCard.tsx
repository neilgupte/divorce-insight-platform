
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinPosition, setPinPosition] = useState({ x: 50, y: 50 });

  // Update pin position based on selected state
  useEffect(() => {
    if (selectedState !== "All States") {
      setShowPin(true);
      
      // Set pin positions based on state selection
      // These are approximate positions on the map image
      const positions: {[key: string]: {x: number, y: number}} = {
        "California": { x: 15, y: 45 },
        "New York": { x: 80, y: 33 },
        "Texas": { x: 45, y: 65 },
        "Florida": { x: 75, y: 75 },
        "Illinois": { x: 60, y: 40 },
        "Washington": { x: 15, y: 20 },
        "Massachusetts": { x: 85, y: 28 },
        "Arizona": { x: 30, y: 55 },
      };
      
      if (positions[selectedState]) {
        setPinPosition(positions[selectedState]);
      } else {
        // Default position if state isn't mapped
        setPinPosition({ x: 50, y: 50 });
      }
    } else {
      setShowPin(false);
    }
  }, [selectedState]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center"><Map className="mr-2 h-5 w-5" /> Divorce Rate Heatmap</CardTitle>
        <CardDescription>
          Interactive visualization of high-net-worth divorce rates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Tabs defaultValue="standard" value={mapType} onValueChange={(value) => setMapType(value)}>
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
            <Button 
              size="sm" 
              variant="outline" 
              className="px-2"
              onClick={() => setZoom(prev => prev === "country" ? "state" : prev === "state" ? "county" : "country")}
            >
              -
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="px-2"
              onClick={() => setZoom(prev => prev === "country" ? "state" : prev === "state" ? "city" : "county")}
            >
              +
            </Button>
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
        
        {/* Map Image with Pin */}
        <div className="relative h-[350px] rounded-md overflow-hidden">
          <img 
            src="/lovable-uploads/1a11e5a3-8087-4ab5-87f9-33d2cab5d813.png" 
            alt="USA Map" 
            className="w-full h-full object-cover"
            style={{
              filter: mapType === "satellite" ? "contrast(1.1) saturate(1.2)" : "none"
            }}
          />
          
          {/* Overlay for layers */}
          {visibleLayers.includes("wealth") && (
            <div className="absolute inset-0 bg-yellow-500/20 mix-blend-overlay pointer-events-none"></div>
          )}
          
          {visibleLayers.includes("divorce") && (
            <div className="absolute inset-0 bg-red-500/20 mix-blend-overlay pointer-events-none"></div>
          )}
          
          {visibleLayers.includes("assets") && (
            <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay pointer-events-none"></div>
          )}
          
          {/* Pin for selected location */}
          {showPin && (
            <div 
              className="absolute" 
              style={{ 
                left: `${pinPosition.x}%`, 
                top: `${pinPosition.y}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <MapPin className="h-8 w-8 text-red-500 drop-shadow-md" />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-background/90 px-2 py-0.5 rounded text-sm font-medium shadow">
                {selectedCity !== "All Cities" ? selectedCity : selectedState}
              </div>
            </div>
          )}
          
          {/* Map Type Indicator */}
          <div className="absolute bottom-4 right-4 bg-background/80 px-2 py-1 rounded text-xs shadow">
            {mapType === "satellite" ? "Satellite View" : "Standard View"} | Zoom: {zoom}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          Interactive map showing high-net-worth divorce trends
        </div>
      </CardContent>
    </Card>
  );
};

export default DummyMapCard;
