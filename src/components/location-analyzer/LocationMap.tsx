
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, Info, Save, AlertTriangle, MapPin } from "lucide-react";
import { US_STATES } from "@/data/mockData";

interface LocationMapProps {
  onSaveView?: (name: string) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ onSaveView }) => {
  const [metric, setMetric] = useState<string>("divorceRate");
  const [region, setRegion] = useState<string>("All States");

  const handleMetricChange = (value: string) => {
    setMetric(value);
  };

  const handleRegionChange = (value: string) => {
    setRegion(value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-muted mb-4 p-4 rounded-md flex justify-between items-center">
        <div className="flex gap-4">
          <Select value={metric} onValueChange={handleMetricChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="divorceRate">Divorce Rate</SelectItem>
              <SelectItem value="netWorth">Avg. Net Worth</SelectItem>
              <SelectItem value="luxuryDensity">Luxury Density</SelectItem>
              <SelectItem value="multiProperty">Multi-Property</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={region} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All States">All States</SelectItem>
              {US_STATES.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Low</span>
            <div className="w-32 h-3 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded-full"></div>
            <span className="text-sm">High</span>
          </div>
          
          <Badge variant="outline" className="ml-2 gap-1 items-center">
            <Info className="h-3 w-3" />
            <span className="text-xs">Click map for details</span>
          </Badge>
          
          {onSaveView && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSaveView(`${metric} - ${region}`)}
            >
              <Save className="mr-2 h-4 w-4" />
              Save View
            </Button>
          )}
        </div>
      </div>
      
      {/* Map component */}
      <div className="flex-1 bg-muted rounded-md overflow-hidden">
        <div className="relative h-full">
          <img 
            src="/lovable-uploads/d50e0d7a-b4c6-4703-ad4d-0819c90db94e.png" 
            alt="USA Map with Hotspots" 
            className="w-full h-full object-cover"
          />
          
          {/* Hotspots */}
          <div className="absolute inset-0">
            {/* San Francisco */}
            <div className="absolute left-[12%] top-[40%] cursor-pointer group">
              <div className="w-10 h-10 bg-blue-500/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
              </div>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                <div className="font-semibold">San Francisco</div>
                <div className="text-sm">Divorce Rate: 4.2%</div>
                <div className="text-sm">Avg. Net Worth: $35.6M</div>
                <div className="text-sm">Luxury Density: 12.1/km²</div>
                <div className="text-sm">Multi-Property: 72%</div>
              </div>
            </div>
            
            {/* New York */}
            <div className="absolute left-[78%] top-[32%] cursor-pointer group">
              <div className="w-10 h-10 bg-red-500/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
              </div>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                <div className="font-semibold">New York</div>
                <div className="text-sm">Divorce Rate: 5.2%</div>
                <div className="text-sm">Avg. Net Worth: $18.5M</div>
                <div className="text-sm">Luxury Density: 8.3/km²</div>
                <div className="text-sm">Multi-Property: 45%</div>
              </div>
            </div>
            
            {/* Miami */}
            <div className="absolute left-[78%] top-[76%] cursor-pointer group">
              <div className="w-10 h-10 bg-orange-500/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
              </div>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                <div className="font-semibold">Miami</div>
                <div className="text-sm">Divorce Rate: 7.2%</div>
                <div className="text-sm">Avg. Net Worth: $28.4M</div>
                <div className="text-sm">Luxury Density: 10.8/km²</div>
                <div className="text-sm">Multi-Property: 68%</div>
              </div>
            </div>
            
            {/* Chicago */}
            <div className="absolute left-[60%] top-[30%] cursor-pointer group">
              <div className="w-10 h-10 bg-green-500/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
              </div>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                <div className="font-semibold">Chicago</div>
                <div className="text-sm">Divorce Rate: 4.8%</div>
                <div className="text-sm">Avg. Net Worth: $12.4M</div>
                <div className="text-sm">Luxury Density: 5.8/km²</div>
                <div className="text-sm">Multi-Property: 34%</div>
              </div>
            </div>
            
            {/* Phoenix */}
            <div className="absolute left-[22%] top-[52%] cursor-pointer group">
              <div className="w-10 h-10 bg-yellow-500/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                <div className="font-semibold">Phoenix</div>
                <div className="text-sm">Divorce Rate: 6.3%</div>
                <div className="text-sm">Avg. Net Worth: $10.5M</div>
                <div className="text-sm">Luxury Density: 4.2/km²</div>
                <div className="text-sm">Multi-Property: 41%</div>
              </div>
            </div>
            
            {/* Selected region pin */}
            {region !== "All States" && (
              <div className="absolute" style={getRegionPinPosition(region)}>
                <MapPin className="h-8 w-8 text-blue-600 drop-shadow-md" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-2 py-0.5 rounded text-sm font-medium shadow">
                  {region}
                </div>
              </div>
            )}
          </div>
          
          {/* Filter Visualization */}
          {metric === "divorceRate" && (
            <div className="absolute inset-0 bg-red-500/10 mix-blend-multiply pointer-events-none"></div>
          )}
          {metric === "netWorth" && (
            <div className="absolute inset-0 bg-blue-500/10 mix-blend-multiply pointer-events-none"></div>
          )}
          {metric === "luxuryDensity" && (
            <div className="absolute inset-0 bg-purple-500/10 mix-blend-multiply pointer-events-none"></div>
          )}
          {metric === "multiProperty" && (
            <div className="absolute inset-0 bg-green-500/10 mix-blend-multiply pointer-events-none"></div>
          )}
          
          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-md shadow">
            <div className="text-sm font-medium mb-1">
              {metric === "divorceRate" && "Divorce Rate"}
              {metric === "netWorth" && "Average Net Worth"}
              {metric === "luxuryDensity" && "Luxury Property Density"}
              {metric === "multiProperty" && "Multi-Property Owners"}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs">Low</span>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get pin position based on region name
const getRegionPinPosition = (region: string): React.CSSProperties => {
  const positions: {[key: string]: {left: string, top: string}} = {
    "California": { left: "15%", top: "45%" },
    "New York": { left: "80%", top: "33%" },
    "Texas": { left: "45%", top: "65%" },
    "Florida": { left: "75%", top: "75%" },
    "Illinois": { left: "60%", top: "40%" },
    "Washington": { left: "15%", top: "20%" },
    "Massachusetts": { left: "85%", top: "28%" },
    "Arizona": { left: "30%", top: "55%" },
  };
  
  return positions[region] || { left: "50%", top: "50%" };
};

export default LocationMap;
