// src/components/network-optimization/NetworkMap.tsx
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";

// This is a public token for demo purposes
const MAPBOX_TOKEN = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOXBzbXI0eTFjdHoya3IwNng1ZTI4ZHoifQ.hgWIXnSx6HdRC67U2xhdxQ";

interface Facility {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  utilisation?: number;
  workers?: number;
  neededWorkers?: number;
  marginalValue?: number;
  laborPoolIndex?: number;
}

interface NetworkMapProps {
  facilities?: Facility[];
  layers?: { commuteRadii?: boolean; populationDensity?: boolean; laborHeatmap?: boolean };
  maxRadius?: number;
  fullscreen?: boolean;
  selectedFacility?: Facility | null;
  onSelectFacility?: (f: Facility) => void;
  showControls?: boolean;
}

const NetworkMap: React.FC<NetworkMapProps> = ({
  facilities = [],
  layers = { commuteRadii: true },
  maxRadius = 30,
  fullscreen = false,
  selectedFacility = null,
  onSelectFacility = () => {},
  showControls = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ id: string; marker: mapboxgl.Marker }[]>([]);
  const circleLayers = useRef<string[]>([]);
  const { toast } = useToast();
  
  // **1. Visible‐facilities state**
  const [visibleIds, setVisibleIds] = useState<string[]>(
    facilities.map((f) => f.id)
  );

  // Update visible IDs when facilities change
  useEffect(() => {
    setVisibleIds(facilities.map((f) => f.id));
  }, [facilities]);

  // draw map + markers + circles
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Clean up any previous map instance
    if (map.current) {
      markers.current.forEach(({ marker }) => marker.remove());
      markers.current = [];
      
      circleLayers.current.forEach((id) => {
        if (map.current?.getLayer(id)) {
          map.current?.removeLayer(id);
        }
        if (map.current?.getSource(id)) {
          map.current?.removeSource(id);
        }
      });
      circleLayers.current = [];
      
      map.current.remove();
    }

    // Set the Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    // Create a delay to ensure the container is fully rendered
    setTimeout(() => {
      // Check if container is still in the document
      if (!mapContainer.current || !document.body.contains(mapContainer.current)) return;
      
      try {
        // Create the map instance
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [-122.4194, 37.7749],
          zoom: 9,
        });
        
        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        
        // Add facilities when map is loaded
        map.current.on("load", () => {
          console.log("Mapbox map loaded successfully");
          
          // Add all facility markers
          facilities.forEach((f) => {
            const el = document.createElement("div");
            el.className = "facility-marker";
            el.style.width = fullscreen ? "16px" : "12px";
            el.style.height = fullscreen ? "16px" : "12px";
            el.style.borderRadius = "50%";
            el.style.backgroundColor = getFacilityColor(f.type);
            el.style.cursor = "pointer";
            el.style.border = "2px solid white";
            el.style.boxShadow = "0 0 4px rgba(0,0,0,0.4)";
            
            // If this is the selected facility, make it larger
            if (selectedFacility && f.id === selectedFacility.id) {
              el.style.width = fullscreen ? "20px" : "16px";
              el.style.height = fullscreen ? "20px" : "16px";
              el.style.backgroundColor = "#4a90e2";
              el.style.zIndex = "10";
            }

            const popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <strong>${f.name}</strong><br/>
                  <span class="text-sm">${f.type}</span><br/>
                  ${f.workers ? `<span class="text-sm">Workers: ${f.workers}</span><br/>` : ''}
                  ${f.utilisation ? `<span class="text-sm">Utilization: ${Math.round(f.utilisation * 100)}%</span>` : ''}
                </div>
              `);

            const m = new mapboxgl.Marker(el)
              .setLngLat([f.lng, f.lat])
              .setPopup(popup)
              .addTo(map.current!);

            el.addEventListener("click", () => onSelectFacility(f));
            markers.current.push({ id: f.id, marker: m });
          });

          // Draw radius circles if enabled
          if (layers.commuteRadii) {
            facilities.forEach((f) => {
              // Generate a unique ID for this circle
              const sid = `circle-${f.id}-${Math.random().toString(36).substring(2, 9)}`;
              const geo = generateCircle([f.lng, f.lat], maxRadius);
              
              // Add the circle to the map
              map.current!.addSource(sid, { type: "geojson", data: geo });
              map.current!.addLayer({
                id: sid,
                type: "fill",
                source: sid,
                paint: {
                  "fill-color": getFacilityColor(f.type, true),
                  "fill-opacity": 0.25,
                },
              });
              circleLayers.current.push(sid);
            });
          }
        });
        
        // Add error handling for map loading
        map.current.on("error", (e) => {
          console.error("Mapbox map error:", e);
          toast({
            title: "Map Error",
            description: "There was an error loading the map. Please try again.",
            variant: "destructive",
          });
        });
      } catch (error) {
        console.error("Error initializing Mapbox map:", error);
        toast({
          title: "Map Error",
          description: "Failed to initialize the map. Please check your connection.",
          variant: "destructive",
        });
      }
    }, 100); // Short delay to ensure container is ready

    // Cleanup function
    return () => {
      markers.current.forEach(({ marker }) => marker.remove());
      markers.current = [];
      circleLayers.current.forEach((id) => {
        if (map.current?.getLayer(id)) {
          map.current?.removeLayer(id);
        }
        if (map.current?.getSource(id)) {
          map.current?.removeSource(id);
        }
      });
      circleLayers.current = [];
      if (map.current) map.current.remove();
    };
  }, [facilities, layers.commuteRadii, maxRadius, fullscreen, selectedFacility, onSelectFacility, toast]);

  return (
    <div className="relative h-full w-full">
      <div 
        ref={mapContainer} 
        className="h-full w-full rounded" 
        style={{ minHeight: fullscreen ? "70vh" : "400px" }}
      />
      {/* Add loading indicator */}
      {!map.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Get color based on facility type
function getFacilityColor(type: string, forCircle: boolean = false): string {
  const baseColors: Record<string, string> = {
    "Distribution": "#4a90e2", // Blue
    "Fulfillment": "#50c878", // Green
    "Storage": "#f5a623",     // Orange
    "Logistics": "#9b59b6",   // Purple
    "default": "#95a5a6"      // Gray
  };
  
  const color = baseColors[type] || baseColors.default;
  
  // For circles, return a lighter version of the color
  if (forCircle) {
    return color;
  }
  
  return color;
}

// simple circle generator
function generateCircle(
  [lng, lat]: [number, number],
  miles: number
): GeoJSON.Feature<GeoJSON.Polygon> {
  const R = 6378137;
  const pts = 64;
  const coords: [number, number][] = [];
  const d = miles * 1609.34;
  for (let i = 0; i <= pts; i++) {
    const a = (i * 2 * Math.PI) / pts;
    const dx = d * Math.cos(a);
    const dy = d * Math.sin(a);
    const dLat = dy / R;
    const dLng = dx / (R * Math.cos((Math.PI * lat) / 180));
    coords.push([
      lng + (dLng * 180) / Math.PI,
      lat + (dLat * 180) / Math.PI,
    ]);
  }
  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [coords] },
    properties: {},
  };
}

export default NetworkMap;
