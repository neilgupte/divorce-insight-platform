
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map } from "lucide-react";
import { US_STATES } from "@/data/mockData";

const LocationMap = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-muted mb-4 p-4 rounded-md flex justify-between items-center">
        <div className="flex gap-4">
          <Select defaultValue="divorceRate">
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
          
          <Select defaultValue="All States">
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
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Low</span>
          <div className="w-32 h-3 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded-full"></div>
          <span className="text-sm">High</span>
        </div>
      </div>
      
      {/* Map Placeholder - In a real implementation, this would be an actual interactive map */}
      <div className="flex-1 bg-muted rounded-md flex items-center justify-center relative">
        <div className="absolute inset-0 p-4 text-white opacity-80 flex items-center justify-center">
          <div className="p-8 rounded-xl bg-background border text-center">
            <Map className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">Interactive Map</h3>
            <p className="text-muted-foreground">This is where the interactive map would be displayed, showing heatmap data for the selected metric across U.S. states.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
