
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZIPCodeDetail } from "../StateMapsOverlay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ZIPDetailPanelProps {
  zipDetail: ZIPCodeDetail;
  onClose: () => void;
}

const ZIPDetailPanel: React.FC<ZIPDetailPanelProps> = ({ zipDetail, onClose }) => {
  // Function to format opportunity tier
  const getOpportunityTier = (value: number): 'Low' | 'Medium' | 'High' => {
    if (value < 1) return 'Low';
    if (value < 10) return 'Medium';
    return 'High';
  };

  // Function to get appropriate color for opportunity tier
  const getOpportunityColor = (tier: 'Low' | 'Medium' | 'High'): string => {
    switch (tier) {
      case 'Low': return 'bg-red-200 text-red-800';
      case 'Medium': return 'bg-red-300 text-red-900';
      case 'High': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  // Calculate the opportunity tier
  const opportunityTier = getOpportunityTier(zipDetail.opportunity);
  const opportunityColor = getOpportunityColor(opportunityTier);

  return (
    <Sheet open={!!zipDetail} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-80 p-0 overflow-auto">
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl">ZIP Code {zipDetail.zipCode}</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </SheetHeader>
        
        <div className="p-4 space-y-4">
          <div className="bg-muted p-3 rounded-md space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">County:</span>
              <span className="text-sm">{zipDetail.county}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">State:</span>
              <span className="text-sm">{zipDetail.state}</span>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Opportunity Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Opportunity Score:</span>
                <Badge className={opportunityColor}>
                  ${zipDetail.opportunity.toFixed(1)}M ({opportunityTier})
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Urbanicity:</span>
                <Badge variant="outline">{zipDetail.urbanicity}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Net Worth:</span>
                <span className="text-sm font-medium">${zipDetail.netWorth.toFixed(1)}M</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Divorce Rate:</span>
                <span className="text-sm font-medium">{(zipDetail.divorceRate * 100).toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Office Location:</span>
                <Badge variant={zipDetail.hasOffice ? "default" : "secondary"}>
                  {zipDetail.hasOffice ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full text-sm">View Detailed Report</Button>
              <Button variant="outline" className="w-full text-sm">Add to Watchlist</Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ZIPDetailPanel;
