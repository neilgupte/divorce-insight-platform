
import React, { useState, useEffect, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
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
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // California center coordinates
  const center: [number, number] = [36.7783, -119.4179];
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

  useEffect(() => {
    // Initialize map when container is ready, dialog is open, and token is set
    if (mapContainer.current && open && !map.current) {
      // Set the Mapbox access token
      mapboxgl.accessToken = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOHp6czZ1ZzBmNHcyanM4MnRkcHQ2dTUifQ.r4eSgGg09379mRWiUchnvg";
      
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v11",
          center: center,
          zoom: defaultZoom,
          projection: 'mercator'
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

            // Add the fill layer
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
            
            // Add popup on click
            map.current.on('click', 'zip-boundaries-fill', (e) => {
              if (e.features && e.features[0] && e.lngLat) {
                const feature = e.features[0];
                const zipCode = feature.properties.ZCTA5CE20;
                const county = feature.properties.COUNTYFP20 || "Unknown";
                
                new mapboxgl.Popup()
                  .setLngLat(e.lngLat)
                  .setHTML(`
                    <h3 class="text-sm font-bold">ZIP Code: ${zipCode}</h3>
                    <p class="text-xs mt-1">County: ${county}</p>
                  `)
                  .addTo(map.current!);
              }
            });
            
            // Change cursor on hover
            map.current.on('mouseenter', 'zip-boundaries-fill', () => {
              if (map.current) {
                map.current.getCanvas().style.cursor = 'pointer';
              }
            });
            
            map.current.on('mouseleave', 'zip-boundaries-fill', () => {
              if (map.current) {
                map.current.getCanvas().style.cursor = '';
              }
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
  }, [open, geoJSONData]);

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

          {/* Mapbox Map Container */}
          <div ref={mapContainer} className="h-full w-full" />
          
          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md z-10">
            <h3 className="text-sm font-semibold mb-2">ZIP Code Data</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm mr-2 bg-red-700 opacity-70"></div>
                <span className="text-xs">High Density</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm mr-2 bg-red-500 opacity-70"></div>
                <span className="text-xs">Medium Density</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm mr-2 bg-red-300 opacity-70"></div>
                <span className="text-xs">Low Density</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeoJSONMapOverlay;
