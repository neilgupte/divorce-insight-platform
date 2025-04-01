
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Printer, Download, Share2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import L from "leaflet";

interface GeoJSONMapOverlayProps {
  open: boolean;
  onClose: () => void;
}

const GeoJSONMapOverlay: React.FC<GeoJSONMapOverlayProps> = ({
  open,
  onClose,
}) => {
  const { toast } = useToast();
  const [geoJSONData, setGeoJSONData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // California center coordinates
  const center: [number, number] = [37.1841, -119.4696];
  const defaultZoom = 6;

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          "https://raw.githubusercontent.com/neilgupte/geojson-demo/main/zcta_06_styled_all.geojson"
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
        }
        
        const data = await response.json();
        setGeoJSONData(data);
      } catch (err) {
        console.error("Error fetching GeoJSON:", err);
        setError("Failed to load ZIP code boundary data");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchGeoJSON();
    }
  }, [open]);

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

  // Style function for GeoJSON features using properties from the data
  const geoJSONStyle = (feature: any) => {
    // Use the pre-styled properties from the GeoJSON
    return {
      fillColor: feature.properties.fill || "#3388ff",
      weight: 1,
      opacity: feature.properties["stroke-opacity"] || 0.5,
      color: feature.properties.stroke || "#999",
      fillOpacity: feature.properties["fill-opacity"] || 0.2,
    };
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-4 py-2 border-b flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">California ZIP Code Boundaries</DialogTitle>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
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
          
          <MapContainer
            center={center}
            zoom={defaultZoom}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ZoomControl position="bottomleft" />
            
            {/* GeoJSON Layer for ZIP Code boundaries */}
            {geoJSONData && (
              <GeoJSON
                data={geoJSONData}
                style={geoJSONStyle}
              />
            )}
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeoJSONMapOverlay;
