import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ZIPCodeData, generateMockZIPData } from "@/lib/zipUtils";
import LeafletMap from "./LeafletMap";
import ZIPCodeDetailOverlay from "./ZIPCodeDetailOverlay";
import { Download, Printer, Share2, X, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ZIPCodeMapOverlayProps {
  open: boolean;
  onClose: () => void;
  initialState?: string;
  initialCity?: string;
}

const ZIPCodeMapOverlay: React.FC<ZIPCodeMapOverlayProps> = ({
  open,
  onClose,
  initialState = "All States",
  initialCity = "All Cities"
}) => {
  const { toast } = useToast();
  const [opportunityFilter, setOpportunityFilter] = useState<'Low' | 'Medium' | 'High' | 'All'>('All');
  const [urbanicityFilter, setUrbanicityFilter] = useState<'Urban' | 'Suburban' | 'Rural' | 'All'>('All');
  const [netWorthRange, setNetWorthRange] = useState<[number, number]>([5, 50]);
  const [divorceRateThreshold, setDivorceRateThreshold] = useState<number>(3);
  const [showExistingOffices, setShowExistingOffices] = useState<boolean>(false);
  const [zipData, setZipData] = useState<ZIPCodeData[]>([]);
  const [selectedZipCode, setSelectedZipCode] = useState<ZIPCodeData | null>(null);

  // Generate mock data for demonstration
  useEffect(() => {
    // Default values for the mock data generator
    const mockData = generateMockZIPData(
      initialState,
      initialCity,
      urbanicityFilter,
      netWorthRange,
      divorceRateThreshold,
      3, // competitorCount
      50 // Generate 50 records for a richer map experience
    );
    setZipData(mockData);
  }, [initialState, initialCity, urbanicityFilter, netWorthRange, divorceRateThreshold]);

  const handleZipClick = (data: ZIPCodeData) => {
    setSelectedZipCode(data);
  };

  const handleCloseZipDetail = () => {
    setSelectedZipCode(null);
  };

  const handleExport = () => {
    toast({
      title: "Map Exported",
      description: "The map has been exported as an image file."
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Prepared",
      description: "Opening print dialog for the current map view."
    });
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://example.com/shared-map/abc123");
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to your clipboard."
    });
  };

  // Format value for net worth range display
  const formatNetWorth = (value: number) => {
    return `$${value}M`;
  };

  // Format value for divorce rate display
  const formatDivorceRate = (value: number) => {
    return `${value}%`;
  };

  // Office locations to show when enabled
  const officeLocations = [
    { city: "New York", position: [40.7128, -74.0060] },
    { city: "Los Angeles", position: [34.0522, -118.2437] },
    { city: "Chicago", position: [41.8781, -87.6298] },
    { city: "Miami", position: [25.7617, -80.1918] },
    { city: "San Francisco", position: [37.7749, -122.4194] }
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-4 py-2 border-b flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">ZIP Code Opportunity Map</DialogTitle>
            <DialogDescription>
              Explore ZIP-level opportunity data across the United States
            </DialogDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        {/* Horizontal Filter Bar */}
        <div className="px-4 py-3 border-b bg-white/90 dark:bg-gray-800/90 flex flex-wrap items-center gap-4">
          {/* Urbanicity Filter */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <Label htmlFor="urbanicity-filter" className="text-xs font-medium">
              Urbanicity Type
            </Label>
            <Select 
              value={urbanicityFilter} 
              onValueChange={(value) => setUrbanicityFilter(value as any)}
            >
              <SelectTrigger id="urbanicity-filter" className="h-9">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Areas</SelectItem>
                <SelectItem value="Urban">Urban</SelectItem>
                <SelectItem value="Suburban">Suburban</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Opportunity Size Filter */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <Label htmlFor="opportunity-filter" className="text-xs font-medium">
              Opportunity Size
            </Label>
            <Select 
              value={opportunityFilter} 
              onValueChange={(value) => setOpportunityFilter(value as any)}
            >
              <SelectTrigger id="opportunity-filter" className="h-9">
                <SelectValue placeholder="All Opportunities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Opportunities</SelectItem>
                <SelectItem value="Low">Low ($0-5M)</SelectItem>
                <SelectItem value="Medium">Medium ($5-10M)</SelectItem>
                <SelectItem value="High">High ($10M+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Net Worth Range Slider with two handles */}
          <div className="flex flex-col gap-1 min-w-[240px]">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Net Worth Range</Label>
              <span className="text-xs text-muted-foreground">
                {formatNetWorth(netWorthRange[0])} - {formatNetWorth(netWorthRange[1])}
              </span>
            </div>
            <Slider
              value={[netWorthRange[0], netWorthRange[1]]}
              min={1}
              max={50}
              step={1}
              onValueChange={(value) => setNetWorthRange([value[0], value[1]])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$1M</span>
              <span>$25M</span>
              <span>$50M+</span>
            </div>
          </div>
          
          {/* Divorce Rate Threshold */}
          <div className="flex flex-col gap-1 min-w-[180px]">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Divorce Rate Threshold</Label>
              <span className="text-xs text-muted-foreground">
                Min {formatDivorceRate(divorceRateThreshold)}
              </span>
            </div>
            <Slider
              value={[divorceRateThreshold]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={(value) => setDivorceRateThreshold(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>5%</span>
              <span>10%+</span>
            </div>
          </div>
          
          {/* Existing Office Location Toggle */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="show-offices" className="text-xs font-medium">Existing office location</Label>
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-offices" 
                checked={showExistingOffices} 
                onCheckedChange={setShowExistingOffices}
              />
              <Label htmlFor="show-offices" className="text-xs">
                {showExistingOffices ? "Yes" : "No"}
              </Label>
            </div>
          </div>
        </div>
        
        <div className="flex-1 relative">
          {/* Main map */}
          <LeafletMap 
            zipData={zipData}
            onZipClick={handleZipClick}
            opportunityFilter={opportunityFilter}
            urbanicityFilter={urbanicityFilter}
            showOfficeLocations={showExistingOffices}
            officeLocations={officeLocations}
            fullscreen={true}
          />
          
          {/* ZIP Code detail overlay */}
          {selectedZipCode && (
            <ZIPCodeDetailOverlay
              zipCodeData={selectedZipCode}
              onClose={handleCloseZipDetail}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZIPCodeMapOverlay;
