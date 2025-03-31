
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
          <div className="relative h-full">
            <img 
              src="/lovable-uploads/d50e0d7a-b4c6-4703-ad4d-0819c90db94e.png" 
              alt="USA Divorce Rate Map" 
              className="w-full h-full object-cover"
            />
            
            {/* Hotspots */}
            <div className="absolute inset-0">
              {/* New York */}
              <div className="absolute left-[78%] top-[32%]">
                <div className="w-6 h-6 bg-red-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
              
              {/* Miami */}
              <div className="absolute left-[78%] top-[76%]">
                <div className="w-6 h-6 bg-orange-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                </div>
              </div>
              
              {/* Chicago */}
              <div className="absolute left-[60%] top-[30%]">
                <div className="w-6 h-6 bg-green-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              {/* San Francisco */}
              <div className="absolute left-[12%] top-[40%]">
                <div className="w-6 h-6 bg-blue-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              
              {/* Phoenix */}
              <div className="absolute left-[22%] top-[52%]">
                <div className="w-6 h-6 bg-yellow-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
              
              {/* Selected state/city pin */}
              {selectedState && selectedState !== "All States" && (
                <div className="absolute" style={getStatePinPosition(selectedState)}>
                  <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center border-2 border-blue-500 animate-pulse">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-2 right-2 bg-white/80 p-1 rounded text-xs">
              <div className="flex items-center gap-1">
                <span>Low</span>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded"></div>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get pin position based on state
const getStatePinPosition = (state: string): React.CSSProperties => {
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
  
  return positions[state] || { left: "50%", top: "50%" };
};

export default MapCard;
