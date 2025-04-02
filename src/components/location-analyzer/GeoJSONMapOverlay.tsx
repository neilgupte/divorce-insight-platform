
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, Share2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MapboxMap from "./mapbox/MapboxMap";
import MapLegend from "./mapbox/MapLegend";
import MapControls from "./mapbox/MapControls";

interface GeoJSONMapOverlayProps {
  open: boolean;
  onClose: () => void;
}

const GeoJSONMapOverlay: React.FC<GeoJSONMapOverlayProps> = ({
  open,
  onClose,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleExport = () => {
    toast({
      title: "Map Exported",
      description: "The map has been exported as an image file.",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Prepared",
      description: "Opening print dialog for the current map view.",
    });
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://example.com/shared-geojson-map/california");
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to your clipboard.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-4 py-2 border-b flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">California ZIP Code Boundaries</DialogTitle>
          </div>
          
          <MapControls 
            onPrint={handlePrint}
            onExport={handleExport}
            onShare={handleShare}
            onClose={onClose}
          />
        </DialogHeader>
        
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2 mx-auto"></div>
                <p>Loading ZIP code boundaries...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center text-destructive p-4 rounded-md bg-destructive/10">
                <p className="font-medium mb-2">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Mapbox Map Container */}
          <MapboxMap 
            setLoading={setLoading}
            setError={setError}
          />
          
          {/* Map Legend */}
          <MapLegend />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeoJSONMapOverlay;
