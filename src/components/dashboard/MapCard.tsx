
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MapView from "@/components/MapView";

interface MapCardProps {
  selectedState: string | null;
  selectedCity: string | null;
}

const MapCard: React.FC<MapCardProps> = ({ selectedState, selectedCity }) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>U.S. High-Net-Worth Divorce Heatmap</CardTitle>
        <CardDescription>
          Interactive map showing divorce rates by state
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] rounded-md overflow-hidden">
          <MapView 
            state={selectedState === "All States" ? null : selectedState} 
            city={selectedCity === "All Cities" ? null : selectedCity}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapCard;
