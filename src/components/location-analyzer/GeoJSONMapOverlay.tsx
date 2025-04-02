
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import MapboxMap from "./mapbox/MapboxMap";
import MapLegend from "./mapbox/MapLegend";
import MapControls from "./mapbox/MapControls";
import MapLoadingState from "./mapbox/MapLoadingState";
import { createMapControlHandlers } from "./mapbox/mapControlHandlers";

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
  
  // Create control handlers
  const { handleExport, handlePrint, handleShare } = createMapControlHandlers(toast);

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
          {/* Loading and Error States */}
          <MapLoadingState loading={loading} error={error} />
          
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
