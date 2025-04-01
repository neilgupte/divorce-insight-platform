
import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Users, 
  Plane, 
  DollarSign, 
  Download, 
  FileText, 
  Share2,
  Star,
  Calendar,
  Users2
} from "lucide-react";
import { ZIPCodeData, CompetitorData, HNWHouseholdStats, LuxuryInfrastructure, generateMockCompetitors, generateHNWHouseholdStats, generateLuxuryInfrastructure, getStateAbbreviation } from "@/lib/zipUtils";
import { useToast } from "@/hooks/use-toast";

interface ZIPCodeDetailOverlayProps {
  zipCodeData: ZIPCodeData;
  onClose: () => void;
}

const ZIPCodeDetailOverlay: React.FC<ZIPCodeDetailOverlayProps> = ({
  zipCodeData,
  onClose
}) => {
  const { toast } = useToast();
  const [hasOffice, setHasOffice] = useState<boolean>(zipCodeData.hasOffice);
  const [competitorCount, setCompetitorCount] = useState<number>(zipCodeData.competitorCount);
  const [competitors] = useState<CompetitorData[]>(
    generateMockCompetitors(zipCodeData.zipCode, zipCodeData.competitorCount)
  );
  const [hnwStats] = useState<HNWHouseholdStats>(
    generateHNWHouseholdStats(zipCodeData.zipCode, zipCodeData.urbanicity)
  );
  const [infrastructure] = useState<LuxuryInfrastructure>(
    generateLuxuryInfrastructure(zipCodeData.zipCode, zipCodeData.urbanicity)
  );
  
  // Calculate opportunity based on current competitor count
  const calculateOpportunity = () => {
    // Simulated divorce rate (based on threshold value)
    const divorceRate = 0.058; // 5.8% (simulated)
    return parseFloat((zipCodeData.tam * divorceRate / (competitorCount + 1)).toFixed(1));
  };
  
  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: `ZIP ${zipCodeData.zipCode} data is being exported to PDF.`
    });
  };
  
  const handleAddToReport = () => {
    toast({
      title: "Added to Report",
      description: `ZIP ${zipCodeData.zipCode} has been added to your current report.`
    });
  };
  
  const handleShareInsights = () => {
    toast({
      title: "Share ZIP Insights",
      description: "ZIP insights link has been copied to clipboard."
    });
  };
  
  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>ZIP Code Overview – {zipCodeData.zipCode}</SheetTitle>
          <SheetDescription>
            {zipCodeData.city}, {getStateAbbreviation(zipCodeData.state)} • {zipCodeData.urbanicity}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          {/* TAM / SAM Section */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Total Addressable Market</Label>
                  <div className="text-xl font-bold">${zipCodeData.tam}M</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Serviceable Market</Label>
                  <div className="text-xl font-bold">${zipCodeData.sam}M</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Competitors</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setCompetitorCount(Math.max(0, competitorCount - 1))}
                    >
                      <span>-</span>
                    </Button>
                    <Input 
                      type="number"
                      min="0"
                      value={competitorCount}
                      onChange={(e) => setCompetitorCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="text-center h-7"
                    />
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setCompetitorCount(competitorCount + 1)}
                    >
                      <span>+</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">$ Opportunity</Label>
                  <div className="text-xl font-bold text-primary">${calculateOpportunity()}M</div>
                </div>
              </div>
              
              <div className="pt-2 flex justify-between items-center">
                <Label htmlFor="has-office" className="flex items-center cursor-pointer gap-2">
                  <Building2 className="h-4 w-4" />
                  Has Office
                </Label>
                <Switch 
                  id="has-office" 
                  checked={hasOffice}
                  onCheckedChange={setHasOffice}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Competitor Intelligence */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Competitor Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 space-y-4">
              {competitors.map((competitor, index) => (
                <div key={index} className="border border-border rounded-md p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{competitor.name}</div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-sm">{competitor.rating}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{competitor.address}</div>
                  <div className="text-sm flex justify-between">
                    <div className="flex items-center gap-1">
                      <Users2 className="h-3 w-3" />
                      <span>{competitor.principal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">{competitor.yearsInOperation} yrs</span>
                      </span>
                      <span className="text-xs">{competitor.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* HNW Household Stats */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                HNW Household Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Count</Label>
                  <div className="text-lg font-bold">{hnwStats.count}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Avg Net Worth</Label>
                  <div className="text-lg font-bold">{hnwStats.averageNetWorth}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Multi-Property</Label>
                  <div className="text-lg font-bold">{hnwStats.multiPropertyPercentage}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Nearby Infrastructure */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                Nearby Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Private Airstrips</Label>
                  <div className="text-lg font-bold">{infrastructure.privateAirstrips}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Luxury Clubs</Label>
                  <div className="text-lg font-bold">{infrastructure.luxuryClubs}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">5-Star Hotels</Label>
                  <div className="text-lg font-bold">{infrastructure.fiveStarHotels}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">High-End Retail</Label>
                  <div className="text-lg font-bold">{infrastructure.highEndRetail}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Separator className="my-6" />
        
        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
          <Button variant="secondary" onClick={handleAddToReport}>
            <FileText className="h-4 w-4 mr-2" />
            Add to Report
          </Button>
          <Button variant="outline" onClick={handleShareInsights}>
            <Share2 className="h-4 w-4 mr-2" />
            Share ZIP Insights
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ZIPCodeDetailOverlay;
