
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, Info, Save, AlertTriangle } from "lucide-react";
import { US_STATES } from "@/data/mockData";
import MapView from "@/components/MapView";
import { MapFilters } from "@/components/map/utils/mapUtils";

interface LocationMapProps {
  onSaveView?: (name: string) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ onSaveView }) => {
  const [metric, setMetric] = useState<string>("divorceRate");
  const [region, setRegion] = useState<string>("All States");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Monitor LocalStorage for API key changes
  useEffect(() => {
    const checkApiKey = () => {
      const hasApiKey = !!localStorage.getItem('googleMapsApiKey');
      setShowSaveButton(hasApiKey); // Only show save button if we have a working map
    };

    // Check initially
    checkApiKey();

    // Set up storage event listener to detect changes
    const handleStorageChange = () => {
      checkApiKey();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Create filter object for MapView based on selected metric
  const getFilters = () => {
    const filters: MapFilters = {
      state: region !== "All States" ? region : null,
      divorceRate: {
        enabled: metric === "divorceRate",
        min: 3.0,
      },
      netWorth: {
        enabled: metric === "netWorth",
        min: 5,
        max: 50,
      },
      luxuryDensity: {
        enabled: metric === "luxuryDensity",
        min: 2,
      },
      multiProperty: {
        enabled: metric === "multiProperty",
        min: 1,
      },
    };
    
    return filters;
  };

  const handleMetricChange = (value: string) => {
    setMetric(value);
    setMapError(null); // Clear any previous errors
  };

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setMapError(null); // Clear any previous errors
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
          {mapError && (
            <Badge variant="destructive" className="gap-1 items-center">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs">{mapError}</span>
            </Badge>
          )}
          
          {showSaveButton && onSaveView && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSaveView(`${metric} - ${region}`)}
            >
              <Save className="mr-2 h-4 w-4" />
              Save View
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Low</span>
            <div className="w-32 h-3 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded-full"></div>
            <span className="text-sm">High</span>
          </div>
          
          <Badge variant="outline" className="ml-2 gap-1 items-center">
            <Info className="h-3 w-3" />
            <span className="text-xs">Click map for details</span>
          </Badge>
        </div>
      </div>
      
      {/* Map component */}
      <div className="flex-1 bg-muted rounded-md">
        <MapView 
          state={region !== "All States" ? region : null} 
          city={null}
          filters={getFilters()}
        />
      </div>
    </div>
  );
};

export default LocationMap;
