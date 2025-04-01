
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
import { ZIPCodeData, generateMockZIPData } from "@/lib/zipUtils";
import LeafletMap from "./LeafletMap";
import ZIPCodeDetailOverlay from "./ZIPCodeDetailOverlay";
import { Download, Printer, Share2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [zipData, setZipData] = useState<ZIPCodeData[]>([]);
  const [selectedZipCode, setSelectedZipCode] = useState<ZIPCodeData | null>(null);
  const [viewMode, setViewMode] = useState<'opportunity' | 'tam'>('opportunity');

  // Generate mock data for demonstration
  useEffect(() => {
    // Default values for the mock data generator
    const mockData = generateMockZIPData(
      initialState,
      initialCity,
      urbanicityFilter,
      [5, 50], // netWorthRange
      3, // divorceRateThreshold
      3, // competitorCount
      50 // Generate 50 records for a richer map experience
    );
    setZipData(mockData);
  }, [initialState, initialCity, urbanicityFilter]);

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
        
        <div className="flex-1 relative">
          {/* Filters overlay */}
          <div className="absolute top-2 left-2 z-10 bg-white/90 dark:bg-gray-800/90 rounded shadow-md p-2 flex gap-2">
            <Select 
              value={opportunityFilter} 
              onValueChange={(value) => setOpportunityFilter(value as any)}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Opportunity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Opportunities</SelectItem>
                <SelectItem value="Low">Low ($0-5M)</SelectItem>
                <SelectItem value="Medium">Medium ($5-10M)</SelectItem>
                <SelectItem value="High">High ($10M+)</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={urbanicityFilter} 
              onValueChange={(value) => setUrbanicityFilter(value as any)}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Urbanicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Areas</SelectItem>
                <SelectItem value="Urban">Urban</SelectItem>
                <SelectItem value="Suburban">Suburban</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Main map */}
          <LeafletMap 
            zipData={zipData}
            viewMode={viewMode}
            onZipClick={handleZipClick}
            opportunityFilter={opportunityFilter}
            urbanicityFilter={urbanicityFilter}
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
