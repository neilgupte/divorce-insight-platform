
import React from "react";
import { X, MapPin, DollarSign, Users, Home, TrendingUp, Building, Award } from "lucide-react";
import { ZIPCodeData } from "@/lib/zipUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ZIPCodeDetailOverlayProps {
  zipCodeData: ZIPCodeData;
  onClose: () => void;
}

const ZIPCodeDetailOverlay: React.FC<ZIPCodeDetailOverlayProps> = ({
  zipCodeData,
  onClose
}) => {
  // Format currency values
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  // Format rate as percentage
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Generate opportunity score
  const opportunityScore = Math.round(
    (zipCodeData.avgNetWorth * 0.4) + 
    (zipCodeData.divorceRate * 100 * 3) + 
    (zipCodeData.luxuryDensity * 0.5) - 
    (zipCodeData.competitors * 0.3)
  );

  // Get opportunity color based on rating
  const getOpportunityColor = (): string => {
    switch (zipCodeData.opportunityRating) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-orange-500';
      case 'Low': return 'bg-amber-400';
      default: return 'bg-orange-500';
    }
  };

  return (
    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background/95 backdrop-blur-sm border-l shadow-xl animate-in slide-in-from-right">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">ZIP Code {zipCodeData.zipCode}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
        <div className="flex items-center mb-4">
          <h4 className="text-xl font-bold">{zipCodeData.city}, {zipCodeData.state}</h4>
          <Badge 
            variant="secondary" 
            className="ml-2"
          >
            {zipCodeData.urbanicity}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 mb-2">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">Opportunity</div>
            <div className="flex items-center mt-1">
              <div className={`w-3 h-3 rounded-full ${getOpportunityColor()} mr-2`}></div>
              <span className="text-lg font-bold">{zipCodeData.opportunityRating}</span>
            </div>
          </Card>

          <Card className="p-4 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">Opportunity Value</div>
            <div className="text-lg font-bold">${zipCodeData.opportunity.toFixed(1)}M</div>
          </Card>
        </div>

        <h4 className="font-semibold mb-2">Demographic Information</h4>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Population</span>
            </div>
            <span className="font-medium">{zipCodeData.population.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Average Income</span>
            </div>
            <span className="font-medium">{formatCurrency(zipCodeData.avgIncome)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Average Net Worth</span>
            </div>
            <span className="font-medium">${zipCodeData.avgNetWorth.toFixed(1)}M</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <h4 className="font-semibold mb-2">Market Metrics</h4>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Divorce Rate</span>
            </div>
            <span className="font-medium">{formatPercentage(zipCodeData.divorceRate)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Home className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Luxury Property Density</span>
            </div>
            <span className="font-medium">{zipCodeData.luxuryDensity.toFixed(1)}/km²</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>High Net-Worth Ratio</span>
            </div>
            <span className="font-medium">{formatPercentage(zipCodeData.highNetWorthRatio)}</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <h4 className="font-semibold mb-2">Competition Analysis</h4>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Building className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Competitor Firms</span>
            </div>
            <span className="font-medium">{zipCodeData.competitors}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Award className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Opportunity Score</span>
            </div>
            <div>
              <Badge 
                variant={opportunityScore > 12 ? "destructive" : opportunityScore > 8 ? "default" : "secondary"}
              >
                {opportunityScore} / 20
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button className="w-full">Analyze This ZIP Code</Button>
        </div>
      </div>
    </div>
  );
};

export default ZIPCodeDetailOverlay;
