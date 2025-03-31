
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MapView from "@/components/MapView";
import { Map } from "lucide-react";

interface MapCardProps {
  selectedState: string | null;
  selectedCity: string | null;
}

const MapCard: React.FC<MapCardProps> = ({ selectedState, selectedCity }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Map className="mr-2 h-5 w-5" /> 
          U.S. High-Net-Worth Divorce Heatmap
        </CardTitle>
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
