
import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Building,
  Users,
  Home,
  Map,
  TrendingUp,
  FileText,
  Plus,
  Link,
  Pin,
  X,
  Plane,
  Building2,
  Store,
  Hotel
} from "lucide-react";
import { ZIPCodeData, getStateAbbreviation } from "@/lib/zipUtils";

interface ZIPCodeDetailOverlayProps {
  zipCodeData: ZIPCodeData;
  onClose: () => void;
}

const ZIPCodeDetailOverlay: React.FC<ZIPCodeDetailOverlayProps> = ({ 
  zipCodeData, 
  onClose 
}) => {
  const [hasOffice, setHasOffice] = useState(false);
  
  // Generate simulated opportunity based on current competitor count
  const calculatedOpportunity = zipCodeData.opportunity;
  
  // Get opportunity tier based on value
  const getOpportunityTier = (value: number) => {
    if (value >= 10) return { label: "High", variant: "destructive" as const };
    if (value >= 5) return { label: "Medium", variant: "secondary" as const };
    return { label: "Low", variant: "default" as const };
  };
  
  const opportunityTier = getOpportunityTier(calculatedOpportunity);
  
  // Mock competitor data
  const competitors = [
    {
      name: "Elite Divorce Partners LLC",
      address: `123 Wealth St, ${zipCodeData.city}, ${getStateAbbreviation(zipCodeData.state)} ${zipCodeData.zipCode}`,
      principal: "Alexandra Morgan, Esq.",
      size: "Large (25+ attorneys)",
      years: 15
    },
    {
      name: "Highworth Family Law Group",
      address: `456 Fortune Ave, ${zipCodeData.city}, ${getStateAbbreviation(zipCodeData.state)} ${zipCodeData.zipCode}`,
      principal: "Jonathan Wells, Esq.",
      size: "Medium (10-24 attorneys)",
      years: 8
    },
    {
      name: "Prestige Matrimonial Solutions",
      address: `789 Luxury Blvd, ${zipCodeData.city}, ${getStateAbbreviation(zipCodeData.state)} ${zipCodeData.zipCode}`,
      principal: "Victoria Reynolds, Esq.",
      size: "Small (2-9 attorneys)",
      years: 12
    }
  ].slice(0, zipCodeData.competitorCount);

  // Mock HNW household data
  const hnwData = {
    totalHouseholds: Math.round(zipCodeData.tam * 10),
    multiPropertyPercent: 68,
    avgProperties: 3.4,
    assetProtectionPercent: 76
  };
  
  // Mock infrastructure data
  const infrastructureData = {
    luxuryRetail: Math.floor(Math.random() * 8) + 3,
    privateAirports: Math.floor(Math.random() * 3),
    exclusiveClubs: Math.floor(Math.random() * 6) + 2,
    fiveStarHotels: Math.floor(Math.random() * 5) + 1
  };
  
  // Mock trend data
  const trendData = {
    caseDuration: {
      months: 9,
      trend: 14, // percent change
      direction: "up" as const
    },
    assetProtection: {
      description: "Pre-divorce LLC transfers",
      percent: 23,
      period: "Q1"
    },
    aiInsight: `ZIP ${zipCodeData.zipCode} shows unusually high legal activity for high-net-worth divorces.`
  };

  return (
    <Sheet open={!!zipCodeData} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[66%] sm:max-w-[66%] overflow-y-auto">
        <SheetHeader className="sticky top-0 bg-background pb-2 pt-6 z-10">
          <SheetTitle className="text-xl flex items-center gap-2">
            <span>ZIP Code Overview – {zipCodeData.zipCode}</span>
            <Badge variant={opportunityTier.variant} className="ml-2">
              Opportunity - {opportunityTier.label}
            </Badge>
          </SheetTitle>
          <div className="text-muted-foreground">
            {zipCodeData.city}, {getStateAbbreviation(zipCodeData.state)}
          </div>
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* 1. ZIP Summary */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Map className="mr-2 h-5 w-5" />
              ZIP Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Total Addressable Market</div>
                <div className="text-xl font-bold">${zipCodeData.tam}M</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Serviceable Market</div>
                <div className="text-xl font-bold">${zipCodeData.sam}M</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Divorce Rate</div>
                <div className="text-xl font-bold">5.8%</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Avg. Net Worth</div>
                <div className="text-xl font-bold">${zipCodeData.tam * 0.1}M</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Net Worth Bracket</div>
                <div className="text-xl font-bold">$10M-$50M</div>
              </div>
              
              {/* Opportunity Card */}
              <div className="border rounded-md p-3 bg-primary/5">
                <div className="text-sm text-muted-foreground">$ Opportunity</div>
                <div className="text-2xl font-bold">
                  <Badge variant={opportunityTier.variant} className="text-lg px-2 py-1">
                    ${calculatedOpportunity.toFixed(1)}M
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* 2. Competitor Intelligence */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Building className="mr-2 h-5 w-5" />
              Competitor Intelligence
            </h3>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Years Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitors.map((comp, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{comp.name}</TableCell>
                      <TableCell>{comp.principal}</TableCell>
                      <TableCell className="text-sm">{comp.address}</TableCell>
                      <TableCell>{comp.size}</TableCell>
                      <TableCell className="text-right">{comp.years}</TableCell>
                    </TableRow>
                  ))}
                  {competitors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No competitor data available for this ZIP code.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <Separator />
          
          {/* 3. HNW Household Metrics */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Users className="mr-2 h-5 w-5" />
              HNW Household Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Total HNW Households</div>
                <div className="text-xl font-bold">{hnwData.totalHouseholds}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Multi-Property Households</div>
                <div className="text-xl font-bold">{hnwData.multiPropertyPercent}%</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Avg. Properties/Household</div>
                <div className="text-xl font-bold">{hnwData.avgProperties}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Asset Protection Entities</div>
                <div className="text-xl font-bold">{hnwData.assetProtectionPercent}%</div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* 4. Nearby Infrastructure */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Home className="mr-2 h-5 w-5" />
              Nearby Infrastructure
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-md p-3 flex flex-col items-center">
                <Store className="h-8 w-8 mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Luxury Retail Hubs</div>
                <div className="text-xl font-bold">{infrastructureData.luxuryRetail}</div>
              </div>
              <div className="border rounded-md p-3 flex flex-col items-center">
                <Plane className="h-8 w-8 mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Private Airports</div>
                <div className="text-xl font-bold">{infrastructureData.privateAirports}</div>
              </div>
              <div className="border rounded-md p-3 flex flex-col items-center">
                <Building2 className="h-8 w-8 mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Exclusive Clubs</div>
                <div className="text-xl font-bold">{infrastructureData.exclusiveClubs}</div>
              </div>
              <div className="border rounded-md p-3 flex flex-col items-center">
                <Hotel className="h-8 w-8 mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">5-Star Hotels</div>
                <div className="text-xl font-bold">{infrastructureData.fiveStarHotels}</div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* 5. Trends & Indicators */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <TrendingUp className="mr-2 h-5 w-5" />
              Trends & Indicators
            </h3>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Divorce Case Duration</div>
                  <Badge variant={trendData.caseDuration.direction === "up" ? "destructive" : "default"}>
                    {trendData.caseDuration.direction === "up" ? "↑" : "↓"} {trendData.caseDuration.trend}% YoY
                  </Badge>
                </div>
                <div className="text-xl font-bold mt-1">Avg. {trendData.caseDuration.months} months</div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{trendData.assetProtection.description}</div>
                  <Badge>
                    ↑ {trendData.assetProtection.percent}% in {trendData.assetProtection.period}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-md p-4 border border-dashed">
                <div className="text-sm text-muted-foreground mb-1">AI Generated Insight</div>
                <div className="text-sm font-medium italic">"{trendData.aiInsight}"</div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* 6. Has Office Toggle */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Building className="mr-2 h-5 w-5" />
              Office Location
            </h3>
            <div className="flex items-center space-x-2">
              <Switch 
                id="has-office" 
                checked={hasOffice}
                onCheckedChange={setHasOffice}
              />
              <Label htmlFor="has-office">
                Do you have an office in this ZIP?
              </Label>
            </div>
          </div>
        </div>
        
        {/* 7. Actions Footer */}
        <SheetFooter className="flex-col sm:flex-row gap-3 mt-6 border-t pt-6">
          <Button className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            Export ZIP Report (PDF)
          </Button>
          <Button variant="outline" className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Add to Report Builder
          </Button>
          <Button variant="outline" className="flex-1">
            <Link className="mr-2 h-4 w-4" />
            Copy Shareable Link
          </Button>
          <Button variant="outline" className="flex-1">
            <Pin className="mr-2 h-4 w-4" />
            Pin to Comparison List
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ZIPCodeDetailOverlay;
