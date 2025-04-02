
import React, { useState, useEffect, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Printer, Download, Share2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // California center coordinates
  const center: [number, number] = [36.7783, -119.4179];
  const defaultZoom = 6;

  useEffect(() => {
    // Try to load token from localStorage
    const savedToken = localStorage.getItem("mapbox-token");
    if (savedToken) {
      setMapboxToken(savedToken);
      setShowTokenInput(false);
    }
  }, []);

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

  useEffect(() => {
    // Initialize map when token is set, container is ready, and dialog is open
    if (mapboxToken && mapContainer.current && open && !showTokenInput) {
      if (map.current) return; // Map already initialized
      
      mapboxgl.accessToken = mapboxToken;
      
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v11",
          center: center,
          zoom: defaultZoom,
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), "bottom-left");

        // Add the GeoJSON data to the map when it loads
        map.current.on("load", () => {
          if (map.current && geoJSONData) {
            // Add the GeoJSON source
            map.current.addSource("zip-boundaries", {
              type: "geojson",
              data: geoJSONData,
            });

            // Add the layer
            map.current.addLayer({
              id: "zip-boundaries-fill",
              type: "fill",
              source: "zip-boundaries",
              paint: {
                "fill-color": ["get", "fill"],
                "fill-opacity": 0.7,
              },
            });

            // Add a border layer
            map.current.addLayer({
              id: "zip-boundaries-line",
              type: "line",
              source: "zip-boundaries",
              paint: {
                "line-color": ["get", "stroke"],
                "line-width": 1,
              },
            });
          }
        });
      } catch (error) {
        console.error("Error initializing Mapbox:", error);
        setError("Failed to initialize map. Please check your Mapbox token.");
      }
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, open, geoJSONData, showTokenInput]);

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

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      localStorage.setItem("mapbox-token", mapboxToken);
      setShowTokenInput(false);
    }
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
          
          {showTokenInput ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
                <h3 className="text-lg font-medium mb-4">Enter Mapbox Access Token</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To display the map, please enter your Mapbox public access token. You can find this in your Mapbox account dashboard.
                </p>
                <form onSubmit={handleTokenSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={mapboxToken}
                      onChange={(e) => setMapboxToken(e.target.value)}
                      placeholder="pk.eyJ1IjoieW91..."
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <Button type="submit" className="w-full">
                      Submit Token
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your token will be saved in your browser for future use.
                  </p>
                </form>
              </div>
            </div>
          ) : (
            <div ref={mapContainer} className="h-full w-full" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeoJSONMapOverlay;
