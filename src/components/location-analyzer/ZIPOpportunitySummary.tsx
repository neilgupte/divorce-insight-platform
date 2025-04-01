
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import ZIPCodeMapOverlay from "./ZIPCodeMapOverlay";

interface ZIPOpportunitySummaryProps {
  selectedState: string;
  selectedCity: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
  netWorthRange?: [number, number];
  divorceRateThreshold?: number;
  urbanicityFilter?: 'Urban' | 'Suburban' | 'Rural' | 'All';
  opportunityFilter?: 'Low' | 'Medium' | 'High' | 'All';
}

const ZIPOpportunitySummary: React.FC<ZIPOpportunitySummaryProps> = ({
  selectedState,
  selectedCity,
  expanded = false,
  onToggleExpand,
  className = "",
  netWorthRange = [5, 50],
  divorceRateThreshold = 3,
  urbanicityFilter = 'All',
  opportunityFilter = 'All'
}) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  // Mock counts - in a real app, these would be calculated from data
  const highCount = 12;
  const mediumCount = 9;
  const lowCount = 7;
  const totalCount = highCount + mediumCount + lowCount;
  
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Map className="mr-2 h-5 w-5" />
            ZIP Opportunity Map
          </CardTitle>
        </div>
        <CardDescription>
          Explore high-opportunity ZIPs across the U.S.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* USA Map Illustration */}
        <div className="relative h-32 bg-muted/30 rounded-md flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="/lovable-uploads/1a11e5a3-8087-4ab5-87f9-33d2cab5d813.png" 
              alt="USA Map" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="z-10 text-center">
            <div className="text-2xl font-bold">{totalCount}</div>
            <div className="text-sm text-muted-foreground">ZIP Codes Analyzed</div>
          </div>
        </div>
        
        {/* Opportunity Tiers */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Opportunity Tiers:</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">High ($10M+)</span>
              </div>
              <span className="font-semibold">{highCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-sm">Medium ($5-10M)</span>
              </div>
              <span className="font-semibold">{mediumCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm">Low ($0-5M)</span>
              </div>
              <span className="font-semibold">{lowCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={() => setIsMapOpen(true)}>
          View Full Map
        </Button>
      </CardFooter>
      
      {/* Map overlay dialog */}
      <ZIPCodeMapOverlay
        open={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialState={selectedState}
        initialCity={selectedCity}
      />
    </Card>
  );
};

export default ZIPOpportunitySummary;
